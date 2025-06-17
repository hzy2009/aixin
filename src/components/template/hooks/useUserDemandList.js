import { ref, reactive, computed, onMounted } from 'vue';
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';

// 模拟的状态映射表，可以从外部传入或在这里定义
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


export function useUserDemandList({otherParams, initialPageSize = 10, statusMapping = defaultStatusMap, url, statusDictKey, userStatCardVisible = false}) {
  const stats = ref({ pendingResponse: 0, inProgress: 0, completed: 0, total: 0 });
  const authStore = useAuthStore();
  const currentFilters = ref({});
  const statusFilter = ref({});
  const search = ref('');
  const isLoading = ref(false);
  const tableData = ref([]);
  const pagination = reactive({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: (total) => `共 ${total} 条`,
    // itemRender can be customized directly in component if needed, or passed as prop to hook
  });
  const selectOptions = (dictKey) => {
    // const all = { value: '', label: '全部' }
    if (!dictKey) return [];
    if (!authStore.sysAllDictItems[dictKey]) return []
    const options = authStore.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
    return [...options];
  }
  // --- API Call Placeholders ---
  // TODO: Replace with actual API calls
  async function fetchStatsAPI() {
    const statusMapp = authStore.sysAllDictItems[statusDictKey] || []
    const res = await defHttp.get({url: url.overview, params: {...otherParams}});
    const result = res.result || [];
    const countMap = {}
    let total = 0
    result.forEach(item => {
      countMap[item.status_code] = item.count
      total = total + item.count
    })
    statusMapp.forEach(item => {
      item.count = countMap[item.value]
    });
    // Simulate different stats for different demand types if necessary
    return {list:statusMapp.slice(0, 5), total:total}
  }

  // --- End API Call Placeholders ---

  async function loadStats() {
    stats.value = await fetchStatsAPI();
  }

  async function loadTableData(propsParans = {}) {
    isLoading.value = true;
    try {
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...currentFilters.value, 
        search: search.value,
        ...statusFilter.value,
        ...otherParams,
        ...propsParans
      };
      const response = await defHttp.get({url: url.list, params});
      tableData.value = response.result.records || [];
      pagination.total = response.result.total || 0;
    } catch (error) {
      tableData.value = [];
      pagination.total = 0;
      // TODO: Show error to user
    } finally {
      isLoading.value = false;
    }
  }

  const handleFiltersChange = (newFilters) => {
    currentFilters.value = { ...newFilters };
    pagination.current = 1; // Reset to first page
    loadTableData();
  };
  const handleStatClick = (statusKey) => {
    const cacaedStatus = currentFilters.value.statusCode;
    if (cacaedStatus === statusKey?.value) {
      currentFilters.value = {statusCode: ''};
    } else {
      currentFilters.value = { ...currentFilters.value,statusCode: statusKey?.value };
    }
    pagination.current = 1; // Reset to first page
    loadTableData();
  };

  const handleSearchTermChange = (newSearchTerm) => {
    search.value = newSearchTerm;
    // Decide if search triggers immediately or on button click
    // For now, let's assume it triggers on button click or Enter
  };

  const triggerSearch = (params = {}) => {
    pagination.current = 1;
    loadTableData(params);
  };

  const handleTablePaginationChange = (pageInfo) => {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize; // If page size changer enabled
    // pagination.pageSize = pageInfo.pageSize; // If page size changer enabled
    loadTableData();
  };

  const getStatusTagColor = (statusKey) => statusMapping[statusKey]?.color || 'default';
  
  const isVIP = computed(() => {
    return authStore.isVip || false;
  });


    /**
   * 导出文件xlsx的mime-type
   */
  const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  /**
   * 导出文件xlsx的文件后缀
   */
  const XLSX_FILE_SUFFIX = '.xlsx';

  const handleExportXls = async (name, url, params, isXlsx = false) => {
    const data = await defHttp.get({ url: url, params: params, responseType: 'blob', timeout: 60000 }, { isTransformResponse: false });
    if (!data) {
      createMessage.warning('文件下载失败');
      return;
    }
    //update-begin---author:wangshuai---date:2024-04-18---for: 导出excel失败提示，不进行导出---
    let reader = new FileReader()
    reader.readAsText(data, 'utf-8')
    reader.onload = async () => {
      if(reader.result){
        if(reader.result.toString().indexOf("success") !=-1){
          // update-begin---author:liaozhiyang---date:2025-02-11---for:【issues/7738】文件中带"success"导出报错 ---
          try {
            const { success, message } = JSON.parse(reader.result.toString());
            if (!success) {
              createMessage.warning('导出失败，失败原因：' + message);
            } else {
              exportExcel(name, isXlsx, data);
            }
            return;
          } catch (error) {
            exportExcel(name, isXlsx, data);
          }
          // update-end---author:liaozhiyang---date:2025-02-11---for:【issues/7738】文件中带"success"导出报错 ---
        }
      }
      exportExcel(name, isXlsx, data);
      //update-end---author:wangshuai---date:2024-04-18---for: 导出excel失败提示，不进行导出---
    }
  }

  const exportExcel = (name, isXlsx, data) => {
    if (!name || typeof name != 'string') {
      name = '导出文件';
    }
    let blobOptions = { type: 'application/vnd.ms-excel' };
    let fileSuffix = '.xls';
    if (isXlsx) {
      blobOptions['type'] = XLSX_MIME_TYPE;
      fileSuffix = XLSX_FILE_SUFFIX;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data], blobOptions), name + fileSuffix);
    } else {
      let url = window.URL.createObjectURL(new Blob([data], blobOptions));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', name + fileSuffix);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  }

  onMounted(() => {
    if (userStatCardVisible) loadStats();
    loadTableData();
  });

  return {
    stats,
    currentFilters,
    search,
    isLoading,
    tableData,
    pagination, // Expose the reactive pagination object
    // Methods
    loadStats,
    loadTableData,
    handleFiltersChange,
    handleStatClick,
    handleSearchTermChange, // If you want to bind v-model directly to search
    triggerSearch,
    handleTablePaginationChange,
    getStatusTagColor,
    selectOptions,
    isVIP,
    handleExportXls,
  };
}