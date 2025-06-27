<template>
    <HomeHeroSection :height="160" v-if="showBanner" />
    <div class="page-title-header container" v-if="pageTitle">
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">{{ pageTitle }}</h2>
    </div>
    <div class="list-page container" :class="{ 'listPageisPadding': listPageisPadding }">
        <!-- Components above the table remain the same -->
        <!-- <div class="stats-bar" v-if="userStatCardVisible">
            <UserStatCardSm :label="item.label" :value="item.count || 0" v-for="item in stats.list"
                :key="item.label + item.count" @click="handleStatClick(item)">
                <template #icon><img src="@/assets/images/user_center/icon-pending.png" alt="未响应" /></template>
            </UserStatCardSm>
        </div> -->
        <UserStatCardSm :stats=stats.list @statsChanged="(item) => handleStatClick(item)" v-if="userStatCardVisible"></UserStatCardSm>
        <UserFilterAccordion :filter-groups="filterConfigForPage" :initial-filters="currentFilters" v-if="filterConfigForPage && filterConfigForPage.length > 0"
            @filters-changed="handleFiltersChange" class="filter-accordion-section" ref="userFilterAccordionRef" />

        <MultiDateRangePickerGroup
            v-if="dateRangeConfig.length > 0"
            :config="dateRangeConfig"
            @values-changed="handleDateValuesUpdate"
            ref="multiDateRangePickerRef"
        />

        <div class="search-action-bar">
            <div class="search-input-wrapper">
                <a-input v-model:value="search" placeholder="请输入关键字" allow-clear @pressEnter="triggerSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
                <div class='rest' @click="handleReset">
                    <DeleteOutlined /> 
                    <span>清空筛选条件</span>
                </div>
            </div>
            <div class="results-count-wrapper" v-if="userSearchTitle">
                <span>为您找到</span>
                <span class="results-count"> {{ pagination.total }} </span>
                <span>个{{ searchTitle }}</span>
            </div>
        </div>
        <div class="table-operations" v-if="tableOperations && tableOperations.length > 0">
            <a-button
                v-for="(Operations, index) in tableOperations"
                :key="index"
                @click="operationsClick(Operations)" 
                :type="Operations.type"
                :class="{'primary-btn': Operations.type == 'primary', 'delecte-btn': Operations.type == 'delete'}" 
                class="operations-btn">
                {{ Operations.title }}
            </a-button>
        </div>
        <slot v-if="$slots['tableCustomOperations']" name="tableCustomOperations" :url="url" :dataSource="tableData" :loadTableData="loadTableData"></slot>
        <slot name="content" :dataSource="tableData" :paginationConfig="pagination" :handleTablePaginationChange="handleTablePaginationChange">
            <div class="results-table-section">
                <!-- VXE-GRID REPLACEMENT -->
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
                    :row-config="{ keyField: 'id' }"
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// Ant Design components can still be used elsewhere on the page
import { Button as AButton, Input as AInput, Tag as ATag } from 'ant-design-vue';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// Your components and hooks remain the same
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';
import UserStatCardSm from '@/components/layout/UserStatCardSm.vue';
import UserFilterAccordion from '@/components/layout/UserFilterAccordion.vue';
import MultiDateRangePickerGroup from '@/components/layout/MultiDateRangePickerGroup.vue';
import { useUserDemandList } from './hooks/useUserDemandList.js';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { selectOptions as getDictOptions, formatDate } from '@/utils/index';
import detailIcon from '@/assets/images/icon-detail.png';
import delIcon from '@/assets/images/icon-delete.png';
const authStore = useAuthStore();
const modalStore = useModalStore();
const router = useRouter();

const userFilterAccordionRef = ref(null);
const props = defineProps({
    pageData: {
        type: Object,
        default: {},
    }
});

const { 
    url, filterConfigForPage, tableColumns, actions, otherParams,
    statusDictKey, userStatCardVisible, showBanner = false, pageTitle,
    tableOperations = [], dateRangeConfig = [], searchTitle, listPageisPadding = true,
    userSearchTitle = true
} = props.pageData;

const {
    selectOptions, stats, currentFilters, search, isLoading, tableData,
    pagination, handleFiltersChange, triggerSearch, handleTablePaginationChange,
    getStatusTagColor, handleStatClick, handleExportXls, clearfilters, isVIP,handleDelete, loadTableData
} = useUserDemandList({
    otherParams, url, statusDictKey, userStatCardVisible
});

filterConfigForPage && filterConfigForPage.forEach(item => {
    if (!item.options && item.dictKey) {
        item.options = selectOptions(item.dictKey);
    }
});

// --- VXE-TABLE ADAPTATION ---

const multiDateRangePickerRef = ref();
const selectedRowKeys = ref([]);

// 1. Adapt columns for vxe-table
const vxeTableColumns = computed(() => {
    const columns = [
        // { type: 'checkbox', width: 50, fixed: 'left' },
    ];
    tableColumns.forEach(col => {
        const vxeCol = {
            ...col
        };
        if (col.fieldType === 'select' && col.dictKey) {
            vxeCol.formatter = ({ cellValue }) => {
                if (getDictOptions(col.dictKey)) {
                    return getDictOptions(col.dictKey).find(option => option.value === cellValue)?.label;
                } else {
                    return '';
                }
            }
        } else if (col.fieldType === 'date') {
            vxeCol.formatter = ({ cellValue }) => {
                return cellValue ? formatDate(cellValue) : '-';
            }
        }
        else if (col.key === 'statusCode') {
            vxeCol.slots = {
                default: ({ row }) => (
                    <ATag color={getStatusTagColor(row.sourcingStatus)} class="status-tag">
                        {row.statusCode}
                    </ATag>
                )
            };
        } else if (col.key === 'actions') {
            vxeCol.slots = {
                default: ({ row }) => (
                    actions.map((action, i) => (
                        action.type == 'del' ? 
                        <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" onConfirm={()=> {
                                handleDelete(row)
                            }} >
                            <span class="action-item">
                                <span><img src={ delIcon} alt="" class="action-icon" /></span>
                                <AButton type="link"  class="action-link" key={i}>
                                    {action.text}
                                </AButton>
                            </span>
                         </a-popconfirm>
                         : 
                        <span class="action-item" onClick={() => handleActionClick(row, action)}>
                            <span><img src={ detailIcon } alt="" class="action-icon" /></span>
                            <AButton type="link"  class="action-link" key={i}>
                                {action.text}
                            </AButton>
                        </span>
                    ))
                )
            };
        }
        columns.push(vxeCol);
    });
    return columns;
});

// 2. Configure the pager (CORRECTED)
const paginationConfig = computed(() => ({
    enabled: true,
    currentPage: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
}));

// 3. Create adapter for pagination event
const handlePageChange = ({ currentPage, pageSize }) => {
    handleTablePaginationChange({ current: currentPage, pageSize });
};

// 4. Create handler for checkbox changes
const handleCheckboxChange = ({ records }) => {
    selectedRowKeys.value = records.map(record => record.id);
};

// --- REST OF THE LOGIC (MOSTLY UNCHANGED) ---

const operationsClick = (btn) => {
    if (authStore?.token) {
        if (btn.btnType == 'exportXls') {
            handleExportXls(btn.fileName, btn.url, {
                selections: selectedRowKeys.value.join(','),
                ...otherParams,
            });
        } else if (btn.btnType == 'delete') {
            triggerSearch({ deleteFlag: 1 });
        } else {
            btn.clickFn();
        }
    } else {
        modalStore.showLogin();
    }
};

const handleDateValuesUpdate = (values) => {
    triggerSearch(values);
};

const handleActionClick = (record, action) => {
    if (authStore?.token) {
        action?.clickFn(record);
    } else {
        modalStore.showLogin();
    }
};


const handleReset = () => {
    clearfilters();
    multiDateRangePickerRef.value?.resetAllDates();
};

defineExpose({
    handleTablePaginationChange
});
</script>

<style scoped lang="less">
// Your original styles for the page layout
@import './styles/list.less';

// Vxe-table specific custom styles can go here if needed.
// The default styles are generally good, but you can override them.
// For example, to style the pager like you did for Ant Design:
:deep(.vxe-pager) {
    margin-top: @spacing-lg;
    
    .vxe-pager--num-btn.is--active {
        background-color: @primary-color;
        border-color: @primary-color;
        color: white;
    }
}

// Keep a-tag styles if you're still using it inside the table
:deep(.status-tag) {
    // Add any specific styles for the tag here
}
:deep(.action-item){
    cursor: pointer;
}
:deep(.action-link) {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0px;
    color: #656C74;
    padding: 4px 5px;
    &:hover {
        color: #656C74;
        // color: @primary-color;
    }
    // Add any specific styles for the action links here
}

// Override vxe-grid border color to match your theme
:deep(.user-demands-table.vxe-grid--border-line) {
    border-color: #f0f0f0; // Or use your LESS variable
}
</style>