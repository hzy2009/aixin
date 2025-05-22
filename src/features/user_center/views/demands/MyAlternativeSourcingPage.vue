<template>
  <div class="my-alternative-sourcing-page">
    <StatsSummaryBar :stats="demandStats" class="page-section" />

    <FilterPanelWithSearch
      :filter-config="alternativeSourcingFilterConfig"
      :initial-filters="dataHook.currentFilters.value"
      :initial-search-term="dataHook.currentSearchTerm.value"
      create-action-text="创建国产替代寻源"
      @filters-updated="handleFiltersUpdated"
      @search-applied="handleSearchApplied"
      @create-action-clicked="handleCreateDemand"
      ref="filterPanelRef"
      class="page-section"
    />

    <div class="results-table-section page-section">
      <div class="table-header">
        <h3>国产替代寻源列表</h3>
        <!-- Can add batch action buttons here if needed -->
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="dataHook.items.value"
        :loading="dataHook.isLoading.value"
        :pagination="tablePagination"
        row-key="id"
        @change="handleTableChange"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'demandTitle'">
            <a @click="viewDemandDetails(record.id)">{{ record.demandTitle }}</a>
          </template>
          <template v-if="column.key === 'sourcingStatus'">
            <a-tag :color="getStatusColor(record.sourcingStatus)">
              {{ formatStatus(record.sourcingStatus) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="viewDemandDetails(record.id)">
                <FileTextOutlined /> 详情
              </a-button>
              <!-- Add more actions like Edit, Delete based on status -->
              <a-button v-if="canEdit(record.sourcingStatus)" type="link" size="small" @click="editDemand(record.id)">
                <EditOutlined /> 编辑
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Table as ATable, Tag as ATag, Button as AButton, Space as ASpace } from 'ant-design-vue';
import { FileTextOutlined, EditOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'; // For stats bar
import StatsSummaryBar from '../../components/StatsSummaryBar.vue';
import FilterPanelWithSearch from '../../components/FilterPanelWithSearch.vue';
import { useDemandData } from '@/features/demand_square/composables/useDemandData.js'; // Assuming this hook is generic enough

const router = useRouter();
const filterPanelRef = ref(null);

// --- Stats Summary ---
// TODO: Fetch these stats from an API
const demandStats = ref([
  { label: '未响应', value: 26, icon: ClockCircleOutlined, imageUrl: '' }, // Use actual image path or AntD icon component
  { label: '进行中', value: 12, icon: SyncOutlined, imageUrl: '' },
  { label: '已完成', value: 52, icon: CheckCircleOutlined, imageUrl: '' },
  { label: '总计', value: 80, icon: QuestionCircleOutlined, imageUrl: '' }, // Or a more appropriate icon
]);

// --- Filter Configuration ---
const alternativeSourcingFilterConfig = ref([
  // Same as your DemandSquarePage filterConfig for 'alternativeSourcing'
  { id: 'category', label: '分类', allowMore: true, maxVisible: 6, options: [ { value: 'pump', label: 'Pump' }, { value: 'mfc', label: 'MFC' },{ value: 'sensor', label: 'Sensor' }, { value: 'valve', label: 'Valve' },{ value: 'motor', label: 'Motor' }, { value: 'actuator', label: 'Actuator' },{ value: 'o-ring', label: 'O-ring' }, { value: 'filter', label: 'Filter' },{ value: 'seal', label: 'Seal' }, { value: 'bearing', label: 'Bearing' }]},
  { id: 'region', label: '区域', allowMore: true, maxVisible: 4, options: [ { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' },{ value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' },{ value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' },{ value: 'dongbei', label: '东北' }]},
  { id: 'sourcingStatus', label: '寻源状态', allowMore: false, options: [ { value: 'pending', label: '寻源发布 (未响应)' }, { value: 'sourcing', label: '寻源中' },{ value: 'found', label: '已寻到' }, { value: 'not_found', label: '未寻到' },{ value: 'closed', label: '已关闭' } ]}
]);

// --- Data Hook ---
// 'myAlternativeSourcing' could be the key for API endpoint in useDemandData
const dataHook = useDemandData('myAlternativeSourcing');
// TODO: Modify useDemandData mock to return data suitable for the table columns

onMounted(() => {
  dataHook.pagination.pageSize = 10; // Default for tables
  dataHook.loadItems();
});

const handleFiltersUpdated = (filters, searchTerm) => {
  dataHook.updateFiltersAndSearch(filters, searchTerm);
};
const handleSearchApplied = (searchTerm, currentActiveFilters) => {
  dataHook.updateFiltersAndSearch(currentActiveFilters, searchTerm);
};

// --- Table Configuration ---
const tableColumns = ref([
  { title: '国产替代寻源', dataIndex: 'demandTitle', key: 'demandTitle', width: '30%' },
  { title: '寻源类型', dataIndex: 'sourcingCategory', key: 'sourcingCategory', width: '15%' },
  { title: '寻源状态', dataIndex: 'sourcingStatus', key: 'sourcingStatus', width: '15%', align: 'center' },
  { title: '截止日期', dataIndex: 'deadlineDate', key: 'deadlineDate', width: '15%', sorter: (a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate) },
  { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: '15%', defaultSortOrder: 'descend', sorter: (a,b) => new Date(a.publishDate) - new Date(b.publishDate)},
  { title: '流程编号', dataIndex: 'processNumber', key: 'processNumber', width: '15%' },
  { title: '操作', key: 'actions', width: '150px', align: 'center', fixed: 'right' },
]);

const tablePagination = computed(() => ({
  total: dataHook.totalItems.value,
  current: dataHook.pagination.currentPage,
  pageSize: dataHook.pagination.pageSize,
  showSizeChanger: true, // Optional
  showQuickJumper: true, // Optional
  pageSizeOptions: ['10', '20', '50'], // Optional
}));

const handleTableChange = (pagination, filters, sorter) => {
  dataHook.pagination.currentPage = pagination.current;
  dataHook.pagination.pageSize = pagination.pageSize;
  // TODO: If backend supports sorting, pass sorter.field and sorter.order to API
  // For now, sorting is client-side if AntD Table does it, or needs to be handled by API
  console.log('Table change:', pagination, filters, sorter);
  dataHook.loadItems(); // Reload with new pagination, and potentially sort/filter params
};

const formatStatus = (statusKey) => {
  const map = { pending: '未响应', sourcing: '寻源中', found: '已寻到', not_found: '未寻到', closed: '已关闭' };
  return map[statusKey] || statusKey;
};
const getStatusColor = (statusKey) => {
  const map = { pending: 'orange', sourcing: 'blue', found: 'green', not_found: 'red', closed: 'default' };
  return map[statusKey] || 'default';
};
const canEdit = (statusKey) => ['pending', 'sourcing'].includes(statusKey);


const viewDemandDetails = (id) => {
  // TODO: Navigate to demand detail page
  router.push(`/user/demands/detail/${id}?type=alternative`);
  console.log('View details for demand:', id);
};
const editDemand = (id) => {
  // TODO: Navigate to demand edit page
  router.push(`/user/demands/edit/${id}?type=alternative`);
  console.log('Edit demand:', id);
};
const handleCreateDemand = () => {
  // TODO: Navigate to create demand page
  router.push('/user/demands/create?type=alternative');
  console.log('Create new alternative sourcing demand');
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.my-alternative-sourcing-page {
  // Overall page styling
}
.page-section {
  margin-bottom: @spacing-lg;
}
.results-table-section {
  background-color: @background-color-base;
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.table-header {
  margin-bottom: @spacing-md;
  h3 {
    font-size: 18px;
    font-weight: 600;
  }
}
// Custom styling for table cells if needed
:deep(.ant-table-cell) {
    // Example: .ant-table-cell a { color: @primary-color; }
}
</style>