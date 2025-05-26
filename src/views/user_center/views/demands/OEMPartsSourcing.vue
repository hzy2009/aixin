<template>
    <div class="list-page">
        <!-- 1. Stats Bar -->
        <div class="stats-bar">
            <UserStatCard label="未响应" :value="stats.pendingResponse || 0">
                <template #icon><img src="@/assets/images/user_center/icon-pending.png" alt="未响应" /></template>
            </UserStatCard>
            <UserStatCard label="进行中" :value="stats.inProgress || 0">
                <template #icon><img src="@/assets/images/user_center/icon-inprogress.png" alt="进行中" /></template>
            </UserStatCard>
            <UserStatCard label="已完成" :value="stats.completed || 0">
                <template #icon><img src="@/assets/images/user_center/icon-completed.png" alt="已完成" /></template>
            </UserStatCard>
            <UserStatCard label="总计" :value="stats.total || 0">
                <template #icon><img src="@/assets/images/user_center/icon-total.png" alt="总计" /></template>
            </UserStatCard>
        </div>

        <!-- 2. Filter Accordion -->
        <UserFilterAccordion :filter-groups="filterConfigForPage" :initial-filters="currentFilters.value"
            @filters-changed="handleFiltersChange" class="filter-accordion-section" ref="userFilterAccordionRef" />

        <!-- 3. Search and Action Bar -->
        <div class="search-action-bar">
            <div class="search-input-wrapper">
                <a-input v-model:value="search" placeholder="请输入关键字" allow-clear @pressEnter="triggerSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
                <a-button type="primary" @click="triggerSearch" class="search-btn">搜索</a-button>
            </div>
            <a-button type="primary" @click="createNewSourcing" class="create-new-btn" v-if="isVIP">
                创建原厂件寻源
            </a-button>
        </div>

        <!-- 4. Results Table -->
        <div class="results-table-section">
            <a-table :columns="tableColumns" :dataSource="tableData" :loading="isLoading" :pagination="paginationConfig"
                row-key="id" @change="handleTablePaginationChange" size="middle" class="user-demands-table">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'sourcingTitle'">
                        <a @click="viewDetails(record.id)" class="title-link">{{ record.sourcingTitle }}</a>
                    </template>
                    <template v-else-if="column.key === 'statusCode'">
                        <a-tag :color="getStatusTagColor(record.sourcingStatus)" class="status-tag">
                            {{ record.statusCode }}
                        </a-tag>
                    </template>
                    <template v-else-if="column.key === 'actions'">
                        <a-button type="link" @click="viewDetails(record.id)" class="action-link">
                            <FileTextOutlined /> 详情
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, computed } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import { Table as ATable, Tag as ATag, Button as AButton, Input as AInput } from 'ant-design-vue';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons-vue';

import UserStatCard from '../../components/UserStatCard.vue';
import UserFilterAccordion from '../../components/UserFilterAccordion.vue';
import { useUserDemandList } from './hooks/useUserDemandList.js'; // Adjust path

const router = useRouter();
const userFilterAccordionRef = ref(null); // Keep if you need to call methods on it

// --- Use the Hook ---
const {
    selectOptions,
    stats,
    currentFilters,       // Ref from hook
    search,    // Ref from hook
    isLoading,            // Ref from hook
    tableData,            // Ref from hook
    pagination,           // Reactive object from hook
    handleFiltersChange,  // Method from hook
    triggerSearch,        // Method from hook
    handleTablePaginationChange, // Method from hook
    getStatusTagColor,     // Method from hook
    isVIP
} = useUserDemandList({
    otherParams: {
        sourcingType: '原厂件寻源'
    },
    url: 'apm/apmSourcing/list'
}); // Pass the specific type for this page

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = ref([
    { id: 'reqPartsType', label: '分类', maxVisibleWithoutMore: 7, options: selectOptions('req_parts_type') },
    // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
    { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, options: selectOptions('sourcing_status') }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = computed(() => [
    { title: '原厂件寻源', dataIndex: 'sourcingTitle', key: 'sourcingTitle', ellipsis: true, },
    { title: '寻源类型', dataIndex: 'sourcingType', key: 'sourcingType', width: '12%', align: 'center' }, // This should be 'sourcingType' from mock
    { title: '寻源件类型', dataIndex: 'reqPartsType', key: 'reqPartsType', width: '12%', align: 'center' }, // Corrected key
    { title: '状态名称', dataIndex: 'statusName', key: 'statusName', width: '10%', align: 'center' }, // Key matches display field
    { title: '寻源有效期', dataIndex: 'expireDate', key: 'expireDate', width: '12%', align: 'center' },
    { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: '12%', align: 'center' },
    { title: '流程编号', dataIndex: 'processNumber', key: 'processNumber', width: '12%', ellipsis: true },
    { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]);

// --- Pagination Config (computed property using hook's pagination) ---
const paginationConfig = computed(() => ({
    ...pagination, // Spread all properties from the hook's pagination object
    itemRender: ({ type, originalElement }) => { // Custom render directly here
        if (type === 'prev' || type === 'next' || type === 'page') return originalElement;
        if (type === 'jump-prev' || type === 'jump-next') {
            return <span class="ant-pagination-item-ellipsis" >•••</span>;
        }
        return null; // Should not happen for other types
    },
}));


// --- Navigation Methods (remain in component) ---
const viewDetails = (id) => {
    // Pass demandType if your detail route needs it
    router.push(`/user/demands/DemandDetailPage/${id}?type=originalSourcing&business_type=originalSourcing`);
};
const createNewSourcing = () => {
    router.push(`/user/demands/DemandDetailPage/create?type=originalSourcing&business_type=originalSourcing`);
};

// onMounted is now handled by the hook for data fetching.
// If DomesticSourcing needs its own onMounted logic for other things, add it here.
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';
@import './styles/list.less';
</style>