<template>
  <div class="my-alternative-sourcing-page">
    <!-- 1. Stats Bar (remains same) -->
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

    <!-- 2. New Filter Accordion -->
    <UserFilterAccordion
      :filter-groups="filterConfigForPage"
      :initial-filters="currentFilters"
      @filters-changed="handleAccordionFiltersChange"
      class="filter-accordion-section"
      ref="userFilterAccordionRef"
    />

    <!-- 3. Search and Action Bar -->
    <div class="search-action-bar">
      <div class="search-input-wrapper">
        <a-input
          v-model:value="currentSearchTerm"
          placeholder="请输入关键字"
          allow-clear
          @pressEnter="triggerSearch"
        >
          <template #prefix> <SearchOutlined /> </template>
        </a-input>
        <a-button type="primary" @click="triggerSearch" class="search-btn">搜索</a-button>
      </div>
      <a-button type="primary" @click="createNewSourcing" class="create-new-btn">
        创建国产替代寻源
      </a-button>
    </div>

    <!-- 4. Results Table -->
    <div class="results-table-section">
      <a-table
        :columns="tableColumns"
        :data-source="tableData"
        :loading="isLoading"
        :pagination="paginationConfig"
        row-key="id"
        @change="handleTableChange"
        size="middle"
        class="user-demands-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'sourcingTitle'">
            <a @click="viewDetails(record.id)" class="title-link">{{ record.sourcingTitle }}</a>
          </template>
          <template v-else-if="column.key === 'sourcingStatus'">
            <a-tag :color="getStatusColor(record.sourcingStatus)" class="status-tag">
              {{ record.sourcingStatusDisplay }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-button type="link" @click="viewDetails(record.id)" class="action-link">
              <FileTextOutlined /> 详情
            </a-button>
            <!-- Add other actions based on status -->
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Table as ATable, Tag as ATag, Button as AButton, Input as AInput, Divider as ADivider } from 'ant-design-vue';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons-vue';

import UserStatCard from '../../components/UserStatCard.vue';
import UserFilterAccordion from '../../components/UserFilterAccordion.vue'; // New filter component

const router = useRouter();
const userFilterAccordionRef = ref(null);

const stats = ref({ pendingResponse: 0, inProgress: 0, completed: 0, total: 0 });
// TODO: API Call - Fetch stats
async function fetchUserDemandStats() {
  await new Promise(resolve => setTimeout(resolve, 300));
  stats.value = { pendingResponse: 26, inProgress: 12, completed: 52, total: 80 };
}

const filterConfigForPage = ref([
  {
    id: 'sourcingType', label: '分类', maxVisibleWithoutMore: 7, // How many items to show before "更多"
    options: [
      { value: 'all', label: '全部' }, // Add '全部' option
      { value: 'pump', label: 'Pump' }, { value: 'mfc', label: 'MFC' },
      { value: 'sensor', label: 'Sensor' }, { value: 'valve', label: 'Valve' },
      { value: 'motor', label: 'Motor' }, { value: 'actuator', label: 'Actuator' },
      { value: 'o-ring', label: 'O-ring' }, { value: 'filter', label: 'Filter' },
      { value: 'seal', label: 'Seal' }, { value: 'bearing', label: 'Bearing' }
    ]
  },
  {
    id: 'region', label: '区域', maxVisibleWithoutMore: 3,
    options: [
      { value: 'all', label: '全部' },
      { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' },
      { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' },
      { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }
    ]
  },
  {
    id: 'sourcingStatus', label: '寻源状态', maxVisibleWithoutMore: 7,
    options: [
      { value: 'all', label: '全部' },
      { value: 'published', label: '寻源发布' }, { value: 'sourcing', label: '寻源中' },
      { value: 'found', label: '已寻到' }, { value: 'not_found', label: '未寻到' },
      { value: 'user_recommended', label: '用户推荐' }, { value: 'third_party_match', label: '三方对接' },
      { value: 'verified', label: '验证' }, { value: 'closed', label: '已关闭' },
      { value: 'inProgress', label: '进行中'}, {value: 'pending', label: '未响应'} // Added from stats bar
    ]
  }
]);

const currentFilters = ref({});
const currentSearchTerm = ref('');

const handleAccordionFiltersChange = (newFilters) => {
  currentFilters.value = { ...newFilters };
  pagination.current = 1;
  fetchTableData();
};

const triggerSearch = () => {
  pagination.current = 1;
  fetchTableData();
};

const isLoading = ref(false);
const tableData = ref([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: false,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
  itemRender: ({ type, originalElement, page }) => { // Custom pagination item render
    if (type === 'prev') return originalElement;
    if (type === 'next') return originalElement;
    if (type === 'jump-prev' || type === 'jump-next') {
        return <span class="ant-pagination-item-ellipsis">•••</span>;
    }
    return originalElement;
  },
});

const tableColumns = computed(() => [
  { title: '国产替代寻源', dataIndex: 'sourcingTitle', key: 'sourcingTitle', ellipsis: true, width: '30%' },
  { title: '寻源类型', dataIndex: 'sourcingTypeDisplay', key: 'sourcingType', width: '12%', align: 'center' },
  { title: '寻源状态', dataIndex: 'sourcingStatus', key: 'sourcingStatus', width: '10%', align: 'center' },
  { title: '截止日期', dataIndex: 'deadlineDate', key: 'deadlineDate', width: '12%', align: 'center' },
  { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate', width: '12%', align: 'center' },
  { title: '流程编号', dataIndex: 'processNumber', key: 'processNumber', width: '12%', ellipsis: true },
  { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]);

const statusMap = {
  pending: { text: '未响应', color: '#faad14' }, // Orange/Yellow
  sourcing: { text: '寻源中', color: '#1890ff' }, // Blue
  found: { text: '已寻到', color: '#52c41a' }, // Green
  inProgress: { text: '进行中', color: '#13c2c2' }, // Cyan
  published: { text: '寻源发布', color: '#2db7f5' }, // Light blue
  not_found: { text: '未寻到', color: '#f5222d' }, // Red
  closed: { text: '已关闭', color: '#bfbfbf' }, // Grey
  user_recommended: { text: '用户推荐', color: 'purple' },
  third_party_match: { text: '三方对接', color: 'magenta' },
  verified: { text: '验证', color: 'lime' },
  all: { text: '全部', color: 'default'} // For filter display if needed
};
const getStatusColor = (statusKey) => statusMap[statusKey]?.color || 'default';

// TODO: API Call - Fetch table data
async function fetchTableData() {
  isLoading.value = true;
  console.log("[TODO API] Fetching user's alternative sourcing list:", {
    page: pagination.current,
    limit: pagination.pageSize,
    filters: currentFilters.value,
    search: currentSearchTerm.value,
  });
  await new Promise(resolve => setTimeout(resolve, 700));

  const mockDataPool = [];
  const statuses = Object.keys(statusMap).filter(s => s !== 'all');
  const types = filterConfigForPage.value.find(f => f.id === 'sourcingType').options.filter(o => o.value !== 'all').map(o => o.label);

  for (let i = 1; i <= 80; i++) { // Simulate 80 total items to match stats bar "总计"
    const statusKey = statuses[i % statuses.length];
    mockDataPool.push({
      id: `demand-${i}`,
      sourcingTitle: `LETH ${675 - i}-092 T091 Parts寻源标题示例，${currentSearchTerm.value} 关键词 ${i}`,
      sourcingType: types[i % types.length].toLowerCase().replace('寻源',''),
      sourcingTypeDisplay: types[i % types.length],
      sourcingStatus: statusKey,
      sourcingStatusDisplay: statusMap[statusKey]?.text || statusKey,
      deadlineDate: `2024/0${(i % 5) + 4}/${(i % 20) + 10}`,
      publishDate: `2024/0${(i % 5) + 3}/${(i % 20) + 10}`,
      processNumber: `A0009234${String(i % 7 + 1).padStart(2,'0')}`,
    });
  }

  let filteredData = [...mockDataPool];
  // Apply filters (client-side mock)
  if (currentFilters.value.sourcingType && currentFilters.value.sourcingType !== 'all') {
    filteredData = filteredData.filter(item => item.sourcingType === currentFilters.value.sourcingType);
  }
  if (currentFilters.value.region && currentFilters.value.region !== 'all') {
    // Mock region - assuming all items match all regions for simplicity now
  }
  if (currentFilters.value.sourcingStatus && currentFilters.value.sourcingStatus !== 'all') {
    filteredData = filteredData.filter(item => item.sourcingStatus === currentFilters.value.sourcingStatus);
  }
  // Apply search (client-side mock)
  if (currentSearchTerm.value) {
    const term = currentSearchTerm.value.toLowerCase();
    filteredData = filteredData.filter(item => item.sourcingTitle.toLowerCase().includes(term));
  }

  pagination.total = filteredData.length;
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  tableData.value = filteredData.slice(startIndex, startIndex + pagination.pageSize);
  isLoading.value = false;
}

const paginationConfig = computed(() => ({ ...pagination }));

const handleTableChange = (pageInfo) => {
  pagination.current = pageInfo.current;
  // pagination.pageSize = pageInfo.pageSize; // If page size changer is enabled
  fetchTableData();
};

const viewDetails = (id) => router.push(`/user/demands/alternative-sourcing/detail/${id}`); // Example detail route
const createNewSourcing = () => router.push('/user/demands/alternative-sourcing/create'); // Example create route

onMounted(() => {
  fetchUserDemandStats();
  fetchTableData();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.my-alternative-sourcing-page {
  // Page itself has no extra padding, UserCenterLayout handles it
}

.stats-bar {
  display: grid; // Use grid for equal width distribution
  grid-template-columns: repeat(4, 1fr); // 4 cards
  gap: @spacing-lg;
  margin-bottom: @spacing-xl;
}

.filter-accordion-section {
  margin-bottom: @spacing-lg;
}

.search-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;
  background-color: #f7f8fa; // Light grey background for this bar
  padding: @spacing-md @spacing-lg;
  border-radius: @border-radius-base;

  .search-input-wrapper {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    .ant-input-affix-wrapper {
      width: 280px; // Fixed width for search input
      border-radius: @border-radius-base;
    }
    .search-btn {
      // Uses AntD primary button style
      border-radius: @border-radius-base;
    }
  }
  .create-new-btn {
     background-color: @primary-color; // Ensure it's the brand red
     border-color: @primary-color;
     border-radius: @border-radius-base;
     &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
     }
  }
}

.results-table-section {
  .title-link {
    color: @text-color-base; // Default title color
    font-weight: 500;
    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }
  .status-tag {
      border-radius: @border-radius-sm; // Small rounded corners
      padding: 2px 8px;
      font-size: 12px;
      border-width: 0px; // No border for these tags as per design
  }
  .action-link {
    padding: 0 @spacing-xs;
    .anticon {
        margin-right: 3px;
    }
  }

  // Ant Design Table Customizations
  :deep(.ant-table) {
    border-radius: @border-radius-base; // Rounded corners for the table
    overflow: hidden; // Needed for border-radius to apply to header
    // border: 1px solid @border-color-light;
  }
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa !important; // Lighter header background
    color: @text-color-base;
    font-weight: 600;
    padding: 12px @spacing-md; // Adjust header padding
    border-bottom: 1px solid @border-color-light; // Stronger line below header
  }
  :deep(.ant-table-tbody > tr > td) {
    padding: 12px @spacing-md; // Adjust cell padding
    font-size: 14px;
    color: @text-color-secondary;
    border-bottom: 1px solid @border-color-light; // Lighter cell separator
  }
  :deep(.ant-table-tbody > tr:last-child > td) {
    border-bottom: none; // No border on the very last row's cells
  }
  :deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
    background-color: #f5f7fa; // Subtle hover for rows
  }
  :deep(.ant-pagination) {
    margin-top: @spacing-lg;
    justify-content: flex-end; // Align pagination to the right
  }
   :deep(.ant-pagination-item-active) {
    background-color: @primary-color;
    border-color: @primary-color;
    a {
        color: white;
    }
    &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
        a { color: white; }
    }
  }
  :deep(.ant-pagination-item-link) { // Prev/Next buttons
    &:not(.ant-pagination-disabled):hover {
        // color: @primary-color;
        // border-color: @primary-color;
    }
  }
   :deep(.ant-pagination-options-quick-jumper input) {
        border-radius: @border-radius-sm;
        &:hover {
            border-color: @primary-color;
        }
        &:focus {
            border-color: @primary-color;
            box-shadow: 0 0 0 2px fade(@primary-color, 20%);
        }
   }
}
</style>