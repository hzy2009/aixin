<!-- 
  通用列表页面模板组件
  - 接收一个 `pageData` 对象作为配置，动态渲染整个列表页面。
  - 包含统计卡片、筛选器、搜索栏、操作按钮和数据表格。
  - 核心逻辑通过 `useUserDemandList` 组合式函数进行管理。
-->
<template>
    <HomeHeroSection :height="160" v-if="showBanner" />
    <div class="page-title-header container" v-if="pageTitle">
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">{{ pageTitle }}</h2>
    </div>
    <div class="list-page container" :class="{ 'listPageisPadding': listPageisPadding }">
        <!-- 统计卡片 -->
        <UserStatCardSm :stats=stats.list @statsChanged="handleStatClickWithPermission" v-if="userStatCardVisible"></UserStatCardSm>
        
        <!-- 筛选器 -->
        <UserFilterAccordion 
            :filter-groups="filterConfigForPage" 
            :initial-filters="initialFilters" 
            v-if="filterConfigForPage && filterConfigForPage.length > 0"
            @filters-changed="handleFiltersChange" 
            class="filter-accordion-section" 
            ref="userFilterAccordionRef" 
        />

        <!-- 日期范围选择 -->
        <MultiDateRangePickerGroup
            v-if="dateRangeConfig && dateRangeConfig.length > 0"
            :config="dateRangeConfig"
            @values-changed="handleDateValuesUpdateWithPermission"
            ref="multiDateRangePickerRef"
        />

        <!-- 搜索栏与操作 -->
        <div class="search-action-bar">
            <div class="search-input-wrapper">
                <a-input v-model:value="search" placeholder="请输入关键字" allow-clear @pressEnter="handleSearchWithPermission" @focus="onSearchFocus" @blur="onSearchBlur">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
                <div class='rest' @click="handleReset">
                    <DeleteOutlined />
                    <span>清空筛选条件</span>
                </div>
                <div class='rest' v-if='isUseFilterDelete' @click="() => triggerSearch({ deleteFlag: 1 })">
                    <span>已删除</span>
                </div>
            </div>
            <div class="results-count-wrapper" v-if="userSearchTitle">
                <span>为您找到</span>
                <span class="results-count">&nbsp;{{ pagination.total }}&nbsp;</span>
                <span>个{{ searchTitle }}</span>
            </div>
        </div>

        <!-- 表格上方操作按钮栏 -->
        <div class="table-operations-bar">
            <div class="table-operations-left" v-if="tableOperations && tableOperations.length > 0">
                <a-button
                    v-for="(op, index) in tableOperations"
                    :key="index"
                    @click="() => handleOperationClick(op)" 
                    :type="op.type"
                    :class="{'primary-btn': op.type == 'primary', 'delecte-btn': op.type == 'delete'}" 
                    class="operations-btn">
                    {{ op.title }}
                </a-button>
            </div>
            <div class="table-operations-right" v-if="tableOperationsRight && tableOperationsRight.length > 0">
                <a-button
                    v-for="(op, index) in tableOperationsRight"
                    :key="index"
                    @click="() => handleOperationClick(op)" 
                    :type="op.type"
                    :class="{'primary-btn': op.type == 'primary', 'delecte-btn': op.type == 'delete'}" 
                    class="operations-btn">
                    {{ op.title }}
                </a-button>
            </div>
        </div>

        <!-- 自定义操作区域插槽 -->
        <slot v-if="$slots['tableCustomOperations']" name="tableCustomOperations" :url="url" :dataSource="tableData" :loadTableData="loadTableData"></slot>
        
        <!-- 隐藏的文件上传输入框 -->
        <input type="file" ref="uploadInputRef" @change="onFileSelected" accept=".xlsx, .xls" style="display: none" />
        
        <!-- 主内容插槽，默认显示vxe-grid表格 -->
        <slot name="content" :dataSource="tableData" :paginationConfig="pagination" :handleTablePaginationChange="handlePageChange" :loading="isLoading">
            <div class="results-table-section">
                <vxe-grid
                    class="user-demands-table"
                    ref="gridRef"
                    :data="tableData"
                    :columns="vxeTableColumns"
                    :loading="isLoading"
                    resizable
                    show-overflow
                    border
                    size="medium"
                    :checkbox-config="{ checkRowKeys: selectedRowKeys }"
                    :pager-config="paginationConfig"
                    @page-change="handlePageChange"
                    @checkbox-change="handleCheckboxChange"
                    @checkbox-all="handleCheckboxChange"
                >
                </vxe-grid>
            </div>
        </slot>
    </div>
</template>

<script setup lang="jsx">
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Button as AButton, Input as AInput, message } from 'ant-design-vue';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';
import UserStatCardSm from '@/components/layout/UserStatCardSm.vue';
import UserFilterAccordion from '@/components/layout/UserFilterAccordion.vue';
import MultiDateRangePickerGroup from '@/components/layout/MultiDateRangePickerGroup.vue';
import { useUserDemandList } from './hooks/useUserDemandList.jsx';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { usePermissions } from '@/utils/usePermissions';

/**
 * @props {Object} pageData - 页面配置对象，定义了此列表页的所有行为和显示内容。
 */
const props = defineProps({
    pageData: {
        type: Object,
        default: () => ({}),
    }
});

// --- 基础实例 ---
const authStore = useAuthStore();
const modalStore = useModalStore();
const router = useRouter();
const { withPermission } = usePermissions();

// --- 模板引用 (Refs for Template Elements) ---
const userFilterAccordionRef = ref(null); // 筛选器组件实例
const multiDateRangePickerRef = ref(null); // 日期选择器组件实例
const uploadInputRef = ref(null); // 文件上传输入框
const gridRef = ref(null); // vxe-grid表格实例
const currentUploadBtn = ref(null); // 当前点击的上传按钮配置

// --- 响应式Props处理 ---
// 使用 toRefs 将 props.pageData 转换为一组响应式引用，确保在父组件更新 prop 时，组件能正确响应。
const pageDataRefs = toRefs(props.pageData);

// 为在模板或此脚本中直接使用的、且可能未定义的props提供默认值，防止 "not iterable" 或 "of undefined" 错误。
const {
    filterConfigForPage = ref([]),
    tableOperations = ref([]),
    tableOperationsRight = ref([]),
    dateRangeConfig = ref([]),
    requiredRoles = ref([]),
    initialFilters = ref({}),
    userStatCardVisible = ref(false), // 为 v-if 提供默认值
    // 其他原始类型（string, boolean）的props在解构时若不存在，其值为undefined，在模板中使用是安全的。
    showBanner, pageTitle, searchTitle, listPageisPadding,
    userSearchTitle, isUseFilterDelete,
} = pageDataRefs;

// --- 核心逻辑组合式函数 ---
// 调用 `useUserDemandList` hook，传入完整的 pageDataRefs，hook内部会处理它所需要的props的默认值。
const {
    stats, search, isLoading, tableData, pagination, searchParams, currentFilters,
    selectedRowKeys, vxeTableColumns, paginationConfig, loadTableData, handleFiltersChange, handleDateChange,
    handleStatClick, triggerSearch, handleExportXls, clearfilters, handleFileUpload,
    handlePageChange, handleCheckboxChange, selectOptions
} = useUserDemandList({
    pageConfig: pageDataRefs,
    handleActionClick, // 将下文定义的函数传递给hook
});

// --- 初始化逻辑 ---
// 动态为筛选器填充字典选项 (现在是安全的，因为 filterConfigForPage 默认是空数组)
filterConfigForPage.value.forEach(item => {
    if (!item.options && item.dictKey) {
        item.options = selectOptions(item.dictKey);
    }
});

// --- 权限包装的事件处理器 ---
// 使用 `withPermission` 高阶函数包装需要权限的搜索和筛选操作
const handleSearchWithPermission = withPermission(requiredRoles.value, triggerSearch, '抱歉，您没有权限执行此搜索操作');
const handleStatClickWithPermission = withPermission(requiredRoles.value, handleStatClick, '抱歉，您没有权限执行此操作');
const handleDateValuesUpdateWithPermission = withPermission(requiredRoles.value, handleDateChange, '抱歉，您没有权限执行此搜索操作');

// --- UI事件处理器 ---

let searchOnFocusValue = ''; // 用于记录搜索框聚焦时的值

/**
 * 搜索框获得焦点时，记录当前值。
 * @param {Event} e - Focus事件对象。
 */
function onSearchFocus(e) {
    searchOnFocusValue = e.target.value;
}

/**
 * 搜索框失焦时，仅当值从“有”变“无”时触发搜索，以避免不必要的操作。
 * @param {Event} e - Blur事件对象。
 */
function onSearchBlur(e) {
    const searchOnBlurValue = e.target.value;
    // 只有当用户清空了输入框（从有内容变为空）后失焦，才触发搜索
    if (searchOnFocusValue !== '' && searchOnBlurValue === '') {
        handleSearchWithPermission();
    }
}

/**
 * 重置所有筛选条件。
 */
function handleReset() {
    clearfilters(); // 清空hook中的筛选状态
    userFilterAccordionRef.value?.resetAllFilters(); // 重置筛选器UI
    multiDateRangePickerRef.value?.resetAllDates(); // 重置日期选择器UI
}

/**
 * 处理表格行内操作点击事件（例如“详情”）。
 * @param {Object} record - 当前行的数据。
 * @param {Object} action - 当前操作的配置。
 */
function handleActionClick(record, action) {
    if (!authStore.token) return modalStore.showLogin(); // 未登录则弹出登录框
    action?.clickFn(record); // 执行在页面配置中定义的回调
}

// --- 表格上方操作按钮 ---
// 使用策略模式定义不同按钮类型的处理器，比 if/else 更清晰且易于扩展。
const operationHandlers = {
    exportXls: (btn) => handleExportXls(btn.fileName, btn.url, {
        selections: selectedRowKeys.value.join(','),
        ...pageDataRefs.otherParams.value, // 确保从响应式引用取值
        search: search.value,
        ...currentFilters.value,
        ...searchParams.value,
        referer: btn.referer || null
    }),
    delete: () => triggerSearch({ deleteFlag: 1 }),
    upload: (btn) => {
        currentUploadBtn.value = btn;
        uploadInputRef.value?.click();
    },
    default: (btn) => btn.clickFn(),
};

/**
 * 操作按钮的统一点击入口。
 * @param {Object} btn - 被点击按钮的配置对象。
 */
const handleOperationClick = (btn) => {
    const handler = operationHandlers[btn.btnType] || operationHandlers.default;
    const actionToExecute = () => handler(btn);
    
    // 统一使用 withPermission 包装器进行权限检查
    withPermission(
        requiredRoles.value,
        actionToExecute,
        '抱歉，您没有权限执行此操作'
    )(); // 立即调用返回的包装后函数
};

// --- 文件上传处理 ---
/**
 * 处理隐藏的input[type=file]选择文件的事件。
 * @param {Event} event - Change事件对象。
 */
async function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
        message.error('请选择.xls或.xlsx格式的Excel文件。');
        if (uploadInputRef.value) uploadInputRef.value.value = '';
        return;
    }

    const uploadUrl = currentUploadBtn.value?.url;
    if (!uploadUrl) {
        message.error('上传URL未配置。');
        if (uploadInputRef.value) uploadInputRef.value.value = '';
        return;
    }

    await handleFileUpload(uploadUrl, file);
    if (uploadInputRef.value) uploadInputRef.value.value = ''; // 清空input，以便再次选择相同文件
}

// --- 向父组件暴露方法 ---
defineExpose({
    loadTableData, // 暴露刷新数据的方法
    getCheckboxRecords: () => gridRef.value?.getCheckboxRecords(), // 暴露获取已勾选行的方法
});
</script>

<style scoped lang="less">
@import './styles/list.less';

:deep(.vxe-pager) {
    margin-top: @spacing-lg;
    .vxe-pager--num-btn.is--active {
        background-color: @primary-color;
        border-color: @primary-color;
        color: white;
    }
}
:deep(.status-tag) {
    /* status tag styles */
}
:deep(.action-item){
    cursor: pointer;
    display: inline-flex;
    align-items: center;
}
:deep(.action-icon) {
    margin-right: 4px;
    vertical-align: middle;
}
:deep(.action-link) {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 12px;
    color: #656C74;
    padding: 4px 5px;
    &:hover {
        color: #656C74;
    }
}
:deep(.not-allowed) {
    color:  rgba(0, 0, 0, 0.25);
    &:hover {
        color:  rgba(0, 0, 0, 0.25);
    }
}
:deep(.user-demands-table.vxe-grid--border-line) {
    border-color: #f0f0f0;
}
</style>
