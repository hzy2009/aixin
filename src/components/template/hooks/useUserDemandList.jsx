import { ref, reactive, computed, onMounted } from 'vue';
import defHttp from '@/utils/http/axios';
import { useAuthStore } from '@/store/authStore';
import { message, Tag as ATag } from 'ant-design-vue';
import { selectOptions as getDictOptions, formatDate } from '@/utils/index';
import { createActionCellRenderer } from './listPage.helpers.jsx';

// 默认的状态-颜色映射表
const defaultStatusMap = {
    pending: { text: '未响应', color: '#faad14' },
    sourcing: { text: '寻源中', color: '#1890ff' },
    found: { text: '已寻到', color: '#52c41a' },
    inProgress: { text: '进行中', color: '#13c2c2' },
    published: { text: '寻源发布', color: '#2db7f5' },
    not_found: { text: '未寻到', color: '#f5222d' },
    closed: { text: '已关闭', color: '#bfbfbf' },
    user_recommended: { text: '用户推荐', color: 'purple' },
    third_party_match: { text: '三方对接', color: 'magenta' },
    verified: { text: '验证', color: 'lime' },
    all: { text: '全部', color: 'default' }
};

/**
 * @description 管理通用列表页面的核心逻辑，包括数据获取、分页、筛选、状态管理等。
 * @param {Object} config - 配置对象。
 * @param {import('vue').Ref<Object>} config.pageConfig - 从listPage组件传入的、包含所有页面配置的响应式对象。
 * @param {Function} config.handleActionClick - 从listPage组件传入的、处理表格行内操作点击的函数。
 * @returns {Object} 返回一个包含列表页面所有状态和方法的对象。
 */
export function useUserDemandList({
    pageConfig,
    handleActionClick,
}) {
    // 解构从父组件传入的页面配置 (已经是 toRefs 后的响应式引用)
    // 为所有可选的 props 提供默认的 ref 值，以增强健壮性
    const {
        url = ref({ list: '', delete: '', overview: '' }),
        otherParams = ref({}),
        initialPageSize = ref(10),
        statusMapping = ref(defaultStatusMap),
        statusDictKey = ref(null),
        userStatCardVisible = ref(false),
        tableColumns = ref([]),
        actions = ref([]),
    } = pageConfig;

    // --- 核心状态定义 ---
    const authStore = useAuthStore();
    const stats = ref({ list: [], total: 0 }); // 统计卡片数据
    const currentFilters = ref({}); // 当前激活的筛选条件
    const dateFilters = ref({}); // 日期筛选条件
    const search = ref(''); // 搜索关键字
    const isLoading = ref(false); // 表格加载状态
    const tableData = ref([]); // 表格数据源
    const searchParams = ref({}); // 额外的搜索参数
    const selectedRowKeys = ref([]); // 表格中已勾选行的ID集合

    // 分页状态
    const pagination = reactive({
        current: 1,
        pageSize: initialPageSize.value, // 安全地访问 .value
        total: 0,
    });

    /**
     * @description 从Pinia Store中获取字典项，并添加“全部”选项。
     * @param {String} dictKey - 字典的key。
     * @returns {Array} 格式化后的选项数组。
     */
    const selectOptions = (dictKey) => {
        const all = { value: '', label: '全部' };
        if (!dictKey || !authStore.sysAllDictItems[dictKey]) return [all];
        const options = authStore.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
        return [all, ...options];
    };

    /**
     * @description 从服务器加载表格数据。
     * @param {Object} options - 加载选项。
     * @param {Boolean} options.resetPage - 是否重置到第一页。
     * @param {Object} options.params - 额外的请求参数。
     */
    async function loadTableData(options = {}) {
        const { resetPage = false, params: extraParams = {} } = options;
        if (resetPage) {
            pagination.current = 1;
        }
        isLoading.value = true;
        try {
            const params = {
                pageNo: pagination.current,
                pageSize: pagination.pageSize,
                ...currentFilters.value,
                ...dateFilters.value,
                search: search.value,
                ...otherParams.value, // .value is needed for refs from toRefs
                ...extraParams
            };
            const response = await defHttp.get({ url: url.value.list, params });
            tableData.value = response.result.records || [];
            pagination.total = response.result.total || 0;
        } catch (error) {
            tableData.value = [];
            pagination.total = 0;
        } finally {
            isLoading.value = false;
        }
    }
    
    /**
     * @description 处理删除操作，内置权限和状态检查。
     * @param {Object} row - 要删除的行数据。
     */
    const handleDelete = ({ id, statusCode, statusName }) => {
        if (statusCode !== 'submit') {
            message.error(`${statusName} 状态的需求无法删除`);
            return;
        }
        isLoading.value = true;
        defHttp.delete({ url: url.value.delete, params: { id } }).then(() => {
            message.success('删除成功');
            loadTableData();
        }).finally(() => {
            isLoading.value = false;
        });
    };

    // --- 计算属性 ---

    // 创建操作列的渲染器
    // 当 actions 未提供时，使用空数组作为默认值，以增加健壮性
    const renderActionCell = createActionCellRenderer(actions?.value || [], handleActionClick, handleDelete);

    // 获取状态标签颜色
    const getStatusTagColor = (statusKey) => (statusMapping[statusKey] || {}).color || 'default';

    // 动态计算并转换vxe-grid所需的列配置
    const vxeTableColumns = computed(() => {
        // 安全检查：当 tableColumns 未在 props 中提供时，使用空数组作为默认值，避免 '.value' of undefined 错误
        const cols = tableColumns?.value || [];
        return cols.map(col => {
            const vxeCol = { ...col };
            // 格式化下拉选择框
            if (col.fieldType === 'select' && col.dictKey) {
                vxeCol.formatter = ({ cellValue }) => getDictOptions(col.dictKey)?.find(option => option.value === cellValue)?.label || '';
            } 
            // 格式化日期
            else if (col.fieldType === 'date') {
                vxeCol.formatter = ({ cellValue }) => cellValue ? formatDate(cellValue) : '-';
            } 
            // 渲染状态标签
            else if (col.key === 'statusCode') {
                vxeCol.slots = {
                    default: ({ row }) => (
                        <ATag color={getStatusTagColor(row.sourcingStatus)} class="status-tag">
                            {row.statusCode}
                        </ATag>
                    )
                };
            } 
            // 渲染操作列
            else if (col.key === 'actions') {
                vxeCol.slots = { default: renderActionCell };
            }
            return vxeCol;
        });
    });

    // 计算vxe-grid所需的分页配置
    const paginationConfig = computed(() => ({
        enabled: true,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
    }));

    // --- 事件处理器 ---

    /**
     * @description 处理vxe-grid分页器页码或每页数量改变的事件。
     * @param {Object} page - 分页信息。
     * @param {Number} page.currentPage - 当前页码。
     * @param {Number} page.pageSize - 每页数量。
     */
    const handlePageChange = async ({ currentPage, pageSize }) => {
        pagination.current = currentPage;
        pagination.pageSize = pageSize;
        await loadTableData();
    };

    /**
     * @description 处理vxe-grid复选框勾选状态改变的事件。
     * @param {Object} param - 事件参数。
     * @param {Array} param.records - 所有已勾选行的完整数据数组。
     */
    const handleCheckboxChange = ({ records }) => {
        selectedRowKeys.value = records.map(record => record.id);
    };

    /**
     * @description 获取统计卡片的数据。
     */
    async function fetchStatsAPI() {
        if (!url.value.overview) return { list: [], total: 0 };
        const statusMapp = authStore.sysAllDictItems[statusDictKey.value] || [];
        const res = await defHttp.get({ url: url.value.overview, params: { ...otherParams.value } });
        const result = res.result || [];
        const countMap = {};
        let total = 0;
        result.forEach(item => {
            countMap[item.status_code] = item.count;
            total += item.count;
        });
        statusMapp.forEach(item => {
            item.count = countMap[item.value] || 0;
        });
        return { list: statusMapp, total: total };
    }

    /**
     * @description 加载统计数据并更新状态。
     */
    async function loadStats() {
        stats.value = await fetchStatsAPI();
    }

    /**
     * @description 处理筛选器组件`filters-changed`事件。
     * @param {Object} newFilters - 最新的筛选条件对象。
     */
    const handleFiltersChange = (newFilters) => {
        currentFilters.value = { ...newFilters };
        // 特殊处理 skillAreaCode_MultiString
        if (currentFilters.value.skillAreaCode_MultiString) {
            currentFilters.value['skillAreaCode'] = `,${currentFilters.value.skillAreaCode_MultiString},`;
            delete currentFilters.value.skillAreaCode_MultiString;
        }
        loadTableData({ resetPage: true });
    };

    /**
     * @description 处理日期范围选择器`values-changed`事件。
     * @param {Object} newDateFilters - 最新的日期筛选条件对象。
     */
    const handleDateChange = (newDateFilters) => {
        dateFilters.value = newDateFilters;
        loadTableData({ resetPage: true });
    };

    /**
     * @description 处理统计卡片的点击事件，用作快速筛选。
     * @param {Object} statusKey - 被点击的状态卡片对象。
     */
    const handleStatClick = (statusKey) => {
        const cachedStatus = currentFilters.value.statusCode;
        // 如果重复点击同一个状态，则取消筛选
        if (cachedStatus === statusKey?.value) {
            currentFilters.value = { ...currentFilters.value, statusCode: '' };
        } else {
            currentFilters.value = { ...currentFilters.value, statusCode: statusKey?.value };
        }
        loadTableData({ resetPage: true });
    };

    /**
     * @description 触发搜索，可附带额外参数。
     * @param {Object} params - 额外的搜索参数。
     */
    const triggerSearch = (params = {}) => {
        searchParams.value = params;
        loadTableData({ resetPage: true, params: params });
    };

    /**
     * @description 处理文件导出请求。
     * @param {String} name - 导出的文件名。
     * @param {String} exportUrl - 导出的URL。
     * @param {Object} params - 导出请求的参数。
     * @param {Boolean} isXlsx - 是否导出为.xlsx格式。
     */
    const handleExportXls = async (name, exportUrl, params, isXlsx = false) => {
        const data = await defHttp.get({ url: exportUrl, params, responseType: 'blob', timeout: 60000 }, { isTransformResponse: false });
        if (!data) return message.warning('文件下载失败');
        
        // 简化后的导出逻辑
        const blob = new Blob([data], { type: isXlsx ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.ms-excel' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = downloadUrl;
        link.setAttribute('download', `${name || '导出文件'}${isXlsx ? '.xlsx' : '.xls'}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    };

    /**
     * @description 清空所有筛选条件并重新加载数据。
     */
    const clearfilters = () => {
        currentFilters.value = {};
        dateFilters.value = {};
        search.value = '';
        loadTableData({ resetPage: true });
    };

    /**
     * @description 处理文件上传。
     * @param {String} uploadUrl - 上传的目标URL。
     * @param {File} file - 要上传的文件对象。
     */
    async function handleFileUpload(uploadUrl, file) {
        if (!uploadUrl || !file) return message.error('上传参数错误');
        isLoading.value = true;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await defHttp.upload({ url: uploadUrl, data: formData });
            if (res.success) {
                message.success(res.message || '上传成功！');
                loadTableData({ resetPage: true });
            } else {
                message.error(res.message || '上传失败。');
            }
        } finally {
            isLoading.value = false;
        }
    }

    // --- 生命周期钩子 ---
    onMounted(() => {
        if (userStatCardVisible.value) loadStats();
        loadTableData();
    });

    // --- 返回 ---
    return {
        // 状态
        stats,
        search,
        isLoading,
        tableData,
        pagination,
        searchParams,
        currentFilters,
        selectedRowKeys,
        // 计算属性
        vxeTableColumns,
        paginationConfig,
        // 方法
        loadTableData,
        handleFiltersChange,
        handleDateChange,
        handleStatClick,
        triggerSearch,
        selectOptions,
        handleExportXls,
        clearfilters,
        handleFileUpload,
        handlePageChange,
        handleCheckboxChange,
    };
}
