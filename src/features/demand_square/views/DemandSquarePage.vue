<template>
  <div class="demand-square-page">
    <!-- 1. Hero Section (Optional - can reuse/adapt from home or create new) -->
    <section class="demand-hero-section">
      <div class="container">
        <h1>需求广场</h1>
        <p>连接供需，高效匹配，加速产业创新与合作</p>
      </div>
    </section>

    <!-- 2. Main Tabs -->
    <div class="container page-tabs-container">
      <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange" class="main-category-tabs">
        <a-tab-pane key="alternativeSourcing" tab="国产替代寻源"></a-tab-pane>
        <a-tab-pane key="originalSourcing" tab="原厂件寻源"></a-tab-pane>
        <a-tab-pane key="rndCollaboration" tab="研发攻关"></a-tab-pane>
        <a-tab-pane key="testingValidation" tab="检测验证"></a-tab-pane>
        <a-tab-pane key="industryReport" tab="行业报告"></a-tab-pane>
        <a-tab-pane key="offlineEvents" tab="线下活动"></a-tab-pane>
        <a-tab-pane key="industryTalent" tab="行业人才"></a-tab-pane>
      </a-tabs>
    </div>

    <!-- Content based on active tab -->
    <div class="container page-content-container">
      <template v-if="activeTabKey === 'alternativeSourcing'">
        <!-- 3. Filter Panel -->
        <FilterPanel
          :filter-config="alternativeSourcingFilterConfig"
          :initial-filters="currentFilters"
          :initial-search-term="currentSearchTerm"
          @filter-change="onFilterUpdate"
          @search="onPerformSearch"
          ref="filterPanelRef"
        />

        <!-- 4. Results Summary and Action Button -->
        <div class="results-summary-bar">
          <div class="summary-text">
            为您找到 <span class="count">{{ totalResults }}</span> 个国产替代寻源
          </div>
          <a-button type="primary" @click="createSourcingRequest" class="create-request-btn">
            <PlusOutlined /> 创建国产替代寻源
          </a-button>
        </div>

        <!-- 5. Results Grid -->
        <div v-if="isLoading" class="loading-spinner">
          <a-spin size="large" />
        </div>
        <div v-else-if="sourcingResults.length > 0" class="results-grid">
          <SourcingResultCard
            v-for="item in sourcingResults"
            :key="item.id"
            :item="item"
          />
        </div>
        <div v-else class="no-results">
          <a-empty description="暂无匹配结果，请调整筛选条件或创建新的寻源请求。" />
        </div>

        <!-- 6. Pagination -->
        <div v-if="sourcingResults.length > 0 && totalResults > pageSize" class="pagination-container">
          <a-pagination
            v-model:current="currentPage"
            :total="totalResults"
            :page-size="pageSize"
            show-less-items
            @change="handlePageChange"
          />
        </div>
      </template>
      <template v-else>
        <!-- Placeholder for other tab content -->
        <div class="placeholder-content">
          <a-empty :description="`内容正在建设中：${getTabName(activeTabKey)}`" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Tabs as ATabs, TabPane as ATabPane, Button as AButton, Spin as ASpin, Empty as AEmpty, Pagination as APagination } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import FilterPanel from '../components/FilterPanel.vue';
import SourcingResultCard from '../components/SourcingResultCard.vue';
// TODO: Import Pinia store if used for API calls or complex state

const activeTabKey = ref('alternativeSourcing'); // Default tab

// --- Filter Configuration (Example for "国产替代寻源") ---
const alternativeSourcingFilterConfig = ref([
  {
    id: 'category', label: '分类', allowMore: true, maxVisible: 6,
    options: [
      { value: 'pump', label: 'Pump' }, { value: 'mfc', label: 'MFC' },
      { value: 'sensor', label: 'Sensor' }, { value: 'valve', label: 'Valve' },
      { value: 'motor', label: 'Motor' }, { value: 'actuator', label: 'Actuator' },
      { value: 'o-ring', label: 'O-ring' }, { value: 'filter', label: 'Filter' },
      { value: 'seal', label: 'Seal' }, { value: 'bearing', label: 'Bearing' }
    ]
  },
  {
    id: 'region', label: '区域', allowMore: true, maxVisible: 4,
    options: [
      { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' },
      { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' },
      { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' },
      { value: 'dongbei', label: '东北' }
    ]
  },
  {
    id: 'status', label: '寻源状态', allowMore: false, // '更多' not applicable here per design
    options: [
      { value: 'published', label: '寻源发布' }, { value: 'sourcing', label: '寻源中' },
      { value: 'found', label: '已寻到' }, { value: 'not_found', label: '未寻到' },
      { value: 'user_recommended', label: '用户推荐' }, { value: 'third_party_match', label: '三方对接' },
      { value: 'verified', label: '验证' }
    ]
  }
]);

const tabNames = {
  alternativeSourcing: '国产替代寻源',
  originalSourcing: '原厂件寻源',
  rndCollaboration: '研发攻关',
  testingValidation: '检测验证',
  industryReport: '行业报告',
  offlineEvents: '线下活动',
  industryTalent: '行业人才',
};
const getTabName = (key) => tabNames[key] || '未知标签';


// --- State for results and pagination ---
const sourcingResults = ref([]);
const isLoading = ref(false);
const totalResults = ref(0);
const currentPage = ref(1);
const pageSize = ref(9); // 3x3 grid

const currentFilters = ref({});
const currentSearchTerm = ref('');
const filterPanelRef = ref(null); // Ref to FilterPanel component

// --- API Call Placeholder ---
async function fetchResultsAPI(filters, searchTerm, page, limit) {
  // TODO: Replace with actual API call
  console.log('Fetching API with:', { filters, searchTerm, page, limit });
  return new Promise(resolve => {
    setTimeout(() => {
      const mockItems = Array.from({ length: limit }, (_, i) => {
        const id = (page - 1) * limit + i + 1;
        return {
          id: `item-${id}`,
          category: filters.category || (['Pump', 'Sensor', 'Valve'])[id % 3],
          title: `${searchTerm || '28nm工艺节点'}核心芯片设计优化方案 - ${id}`,
          views: Math.floor(Math.random() * 200) + 10,
          description: `攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容... 产品编号 ${id}${filters.region ? `(${filters.region})` : ''}`,
          date: `2024-0${Math.floor(id % 9) + 1}-${String(Math.floor(id % 28) + 1).padStart(2, '0')}`,
          location: filters.region ? filters.region.toUpperCase() : (['华东', '华南', '华中'])[id % 3],
        };
      });
      // Simulate filtering based on searchTerm (very basic)
      const filteredItems = searchTerm
        ? mockItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : mockItems;

      const total = searchTerm ? filteredItems.length * 3 : 582; // Simulate total based on search

      resolve({
        data: filteredItems.slice(0, limit),
        total: total, // Simulate a larger total for pagination
      });
    }, 800);
  });
}

async function loadSourcingResults() {
  if (activeTabKey.value !== 'alternativeSourcing') {
    sourcingResults.value = [];
    totalResults.value = 0;
    return;
  }
  isLoading.value = true;
  try {
    const response = await fetchResultsAPI(
      currentFilters.value,
      currentSearchTerm.value,
      currentPage.value,
      pageSize.value
    );
    sourcingResults.value = response.data;
    totalResults.value = response.total;
  } catch (error) {
    console.error("Error fetching sourcing results:", error);
    sourcingResults.value = [];
    totalResults.value = 0;
    // TODO: Show error message to user
  } finally {
    isLoading.value = false;
  }
}

const onFilterUpdate = (filters, searchTerm) => {
  currentFilters.value = filters;
  currentSearchTerm.value = searchTerm; // FilterPanel might also update search term
  currentPage.value = 1; // Reset to first page on filter change
  loadSourcingResults();
};

const onPerformSearch = (searchTerm) => {
  currentSearchTerm.value = searchTerm;
  currentPage.value = 1;
  loadSourcingResults();
}

const handleTabChange = (key) => {
  console.log('Tab changed to:', key);
  activeTabKey.value = key;
  currentPage.value = 1;
  // Reset filters for the new tab or load specific filters for it
  if (filterPanelRef.value) {
    // filterPanelRef.value.resetFilters(); // Or load saved filters for this tab
  }
  currentFilters.value = {};
  currentSearchTerm.value = '';
  loadSourcingResults(); // Load data for the new tab
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadSourcingResults();
};

const createSourcingRequest = () => {
  // TODO: Navigate to a form or open a modal to create a new request
  console.log('Create new sourcing request clicked');
  // router.push('/demand-square/create');
};

onMounted(() => {
  loadSourcingResults();
});

// Watch for activeTabKey changes if not handled by @change on tabs
// watch(activeTabKey, () => {
//   loadSourcingResults();
// });

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.demand-square-page {
  background-color: @background-color-light-gray; // Overall page background
  min-height: calc(100vh - @layout-header-height - @layout-footer-height); // Adjust footer height if dynamic
}

.demand-hero-section {
  background: linear-gradient(to bottom, lighten(@primary-color, 25%), lighten(@primary-color, 45%)); // Light green/blueish gradient from design
  // Or use an image: background-image: url('@/assets/images/demand-hero-bg.jpg');
  background-size: cover;
  background-position: center;
  padding: 50px 0;
  text-align: center;
  color: @text-color-base; // Darker text on light hero

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: @spacing-sm;
    color: darken(@primary-color, 10%);
  }
  p {
    font-size: 16px;
    color: @text-color-secondary;
    max-width: 600px;
    margin: 0 auto;
  }
}

.page-tabs-container {
  background-color: @background-color-base; // White background for the tab bar area
  // box-shadow: 0 1px 3px rgba(0,0,0,0.06); // Optional subtle shadow below tabs
  border-bottom: 1px solid @border-color-light; // Line below the entire tab bar
  padding-top: 0; // Tabs sit flush at the top of this container
  margin-bottom: @spacing-lg; // Space between tabs and filter panel
}

.main-category-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 0; // Remove default bottom margin
    &::before { // Remove AntD's default bottom border for the nav
        display: none;
    }
  }
  :deep(.ant-tabs-nav-wrap) {
    // No specific styles needed here
  }
  :deep(.ant-tabs-nav-list) {
    // display: flex; // AntD default
    border-left: 1px solid @border-color-light; // Left border for the first tab
  }

  :deep(.ant-tabs-tab) {
    height: 60px;
    padding: 0 37px; // Adjust padding for content fit
    margin: 0 !important; // Override AntD margin
    font-size: 16px;
    font-weight: 500;
    color: @text-color-base; // Default text color for inactive tabs
    background-color: @background-color-base; // White background for inactive tabs
    border-right: 1px solid @border-color-light; // Separator line for inactive tabs
    transition: background-color 0.2s ease, color 0.2s ease;
    border-bottom: none !important; // Remove individual tab bottom border if AntD adds one

    .ant-tabs-tab-btn {
        transition: color 0.2s ease;
    }

    &:hover {
      color: @primary-color; // Text color on hover for inactive tabs
      background-color: #f7f7f7; // Slightly off-white background on hover
    }
  }

  :deep(.ant-tabs-tab-active) {
    background-color: @primary-color !important; // Solid red background for active tab
    border-right-color: @primary-color !important; // Match border color

    .ant-tabs-tab-btn {
      color: @text-color-light !important; // White text for active tab
      font-weight: 600;
    }
     &:hover { // Override hover for active tab if needed
        background-color: @primary-color !important;
        .ant-tabs-tab-btn {
            color: @text-color-light !important;
        }
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none !important; // Hide the ink bar as per the design
  }
}

.page-content-container {
  padding-top: @spacing-lg;
  padding-bottom: @spacing-xl;
}

.results-summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;
  padding: @spacing-sm @spacing-md;

  .summary-text {
    font-size: 14px;
    color: @text-color-base;
    .count {
      color: @primary-color;
      font-weight: bold;
      font-size: 16px;
      margin: 0 3px;
    }
  }
  .create-request-btn {
    background-color: @primary-color;
    // border-color: @primary-color;
    .anticon {
        margin-right: @spacing-xs;
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); // Responsive grid
  gap: @spacing-lg;
  margin-bottom: @spacing-xl;

   @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

.loading-spinner, .no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px; // Ensure it takes some space
  margin-bottom: @spacing-xl;
}
.no-results {
    :deep(.ant-empty-description) {
        color: @text-color-secondary;
    }
}

.pagination-container {
  text-align: center;
  margin-top: @spacing-xl;
}

.placeholder-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: @spacing-xxl 0;
  min-height: 300px;
}
</style>