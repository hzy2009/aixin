<template>
  <div class="demand-square-page">
    <!-- 1. Hero Section (remains the same) -->
    <section class="demand-hero-section">
      <div class="container">
        <h1>需求广场</h1>
        <p>连接供需，高效匹配，加速产业创新与合作</p>
      </div>
    </section>

    <!-- 2. Reusable Tab Navigation (remains the same) -->
    <DemandPageTabs
      :tabs="pageTabs"
      :active-key="activeTabKey"
      @tab-change="handleTabChange"
    />

    <div class="container page-content-container">
      <div :key="activeTabKey" class="tab-content-wrapper">
        <template v-if="currentDemandDataHookInstance">
          <FilterPanel
            :filter-config="currentFilterConfig"
            :initial-filters="currentDemandDataHookInstance.currentFilters.value"
            :initial-search-term="currentDemandDataHookInstance.currentSearchTerm.value"
            @filters-updated="handleFiltersUpdated"
            @search-term-applied="handleSearchTermApplied"
            ref="filterPanelRef"
            class="content-section"
          />

          <div class="results-summary-bar content-section">
            <div class="summary-text">
              为您找到 <span class="count">{{ currentDemandDataHookInstance.totalItems.value }}</span> 个{{ getTabName(activeTabKey) }}
            </div>
            <!-- "创建行业报告" button might be different or not present -->
            <a-button v-if="activeTabKey !== 'industryReport'" type="primary" @click="createRequest" class="create-request-btn">
              <PlusOutlined /> 创建{{ getTabName(activeTabKey) }}
            </a-button>
            <a-button v-else type="primary" @click="uploadReport" class="create-request-btn">
              <UploadOutlined /> 上传行业报告
            </a-button>
          </div>

          <div v-if="currentDemandDataHookInstance.isLoading.value" class="loading-spinner content-section">
            <a-spin size="large" />
          </div>

          <!-- Conditional Rendering for different list/grid views -->
          <template v-else-if="currentDemandDataHookInstance.items.value && currentDemandDataHookInstance.items.value.length > 0">
            <div v-if="activeTabKey === 'industryReport'" class="results-list content-section">
              <IndustryReportItem
                v-for="item in currentDemandDataHookInstance.items.value"
                :key="item.id"
                :report="item"
              />
            </div>
            <div v-else class="results-grid content-section">
              <SourcingResultCard
                v-for="item in currentDemandDataHookInstance.items.value"
                :key="item.id"
                :item="item"
                :item-type="activeTabKey"
              />
            </div>
          </template>
          <div v-else class="no-results content-section">
            <a-empty :description="`暂无${getTabName(activeTabKey)}匹配结果，请尝试调整筛选条件。`" />
          </div>

          <div
            v-if="currentDemandDataHookInstance.items.value && currentDemandDataHookInstance.items.value.length > 0 && currentDemandDataHookInstance.totalItems.value > currentDemandDataHookInstance.pagination.pageSize"
            class="pagination-container content-section"
          >
            <a-pagination
              v-model:current="currentDemandDataHookInstance.pagination.currentPage"
              :total="currentDemandDataHookInstance.totalItems.value"
              :page-size="currentDemandDataHookInstance.pagination.pageSize"
              show-less-items
              show-quick-jumper
              @change="handlePageChange"
            />
          </div>
        </template>
        <template v-else>
          <div class="placeholder-content content-section">
            <a-empty :description="`“${getTabName(activeTabKey)}”内容正在建设中...`" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Button as AButton, Spin as ASpin, Empty as AEmpty, Pagination as APagination } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

import DemandPageTabs from '../components/DemandPageTabs.vue';
import FilterPanel from '../components/FilterPanel.vue';
import SourcingResultCard from '../components/SourcingResultCard.vue'; // Assuming this card is generic enough
import IndustryReportItem from '../components/IndustryReportItem.vue'; // Import new component
import { useDemandData } from '../composables/useDemandData.js';

const router = useRouter();
const activeTabKey = ref('alternativeSourcing'); // Default still can be alternative
const filterPanelRef = ref(null);

// --- Tab Configuration ---
// Ensure 'originalSourcing' has usesDemandHook: true
const pageTabs = ref([
  { key: 'alternativeSourcing', label: '国产替代寻源', usesDemandHook: true },
  { key: 'originalSourcing', label: '原厂件寻源', usesDemandHook: true }, // This is the one we're focusing on
  { key: 'rndCollaboration', label: '研发攻关', usesDemandHook: true },
  { key: 'testingValidation', label: '检测验证', usesDemandHook: true },
  { key: 'industryReport', label: '行业报告', usesDemandHook: true },
  { key: 'offlineEvents', label: '线下活动', usesDemandHook: false },
  { key: 'industryTalent', label: '行业人才', usesDemandHook: false },
]);

const getTabName = (key) => {
  const tab = pageTabs.value.find(t => t.key === key);
  return tab ? tab.label : '内容';
};

// --- Filter Configurations for each relevant tab ---
// TODO: DEFINE THE ACTUAL FILTER OPTIONS FOR 'originalSourcing'
const filterConfigs = {
  alternativeSourcing: [ /* ... as before ... */ { id: 'category', label: '分类', allowMore: true, maxVisible: 6, options: [ { value: 'pump', label: 'Pump' }, { value: 'mfc', label: 'MFC' },{ value: 'sensor', label: 'Sensor' }, { value: 'valve', label: 'Valve' },{ value: 'motor', label: 'Motor' }, { value: 'actuator', label: 'Actuator' },{ value: 'o-ring', label: 'O-ring' }, { value: 'filter', label: 'Filter' },{ value: 'seal', label: 'Seal' }, { value: 'bearing', label: 'Bearing' }]}, { id: 'region', label: '区域', allowMore: true, maxVisible: 4, options: [ { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' },{ value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' },{ value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' },{ value: 'dongbei', label: '东北' }]}, { id: 'status', label: '寻源状态', allowMore: false, options: [ { value: 'published', label: '寻源发布' }, { value: 'sourcing', label: '寻源中' },{ value: 'found', label: '已寻到' }, { value: 'not_found', label: '未寻到' },{ value: 'user_recommended', label: '用户推荐' }, { value: 'third_party_match', label: '三方对接' },{ value: 'verified', label: '验证' }]} ],
  originalSourcing: [ /* ... as before ... */ { id: 'manufacturer', label: '品牌', allowMore: true, maxVisible: 6, options: [ { value: 'ti', label: 'TI (德州仪器)' }, { value: 'adi', label: 'ADI (亚德诺)' }, { value: 'stmicro', label: 'ST (意法半导体)' }, { value: 'infineon', label: 'Infineon (英飞凌)' }, { value: 'nxp', label: 'NXP (恩智浦)' }, { value: 'renesas', label: 'Renesas (瑞萨)' }, { value: 'microchip', label: 'Microchip (微芯)' }, { value: 'onsemi', label: 'onsemi (安森美)' } ] }, { id: 'partCategory', label: '器件分类', allowMore: true, maxVisible: 5, options: [ { value: 'mcu', label: 'MCU' }, { value: 'fpga', label: 'FPGA' }, { value: 'memory', label: '存储器' }, { value: 'powerIc', label: '电源IC' }, { value: 'analog', label: '模拟器件' }, { value: 'sensor', label: '传感器' }, { value: 'discrete', label: '分立器件' } ] }, { id: 'availability', label: '供货状态', allowMore: false, options: [ { value: 'inStock', label: '现货' }, { value: 'futureDelivery', label: '期货' }, { value: 'eol', label: '停产 (EOL)' }, { value: 'sample', label: '样品' } ] } ],
  rndCollaboration: [ /* ... as before ... */ { id: 'techDomain', label: '技术领域', allowMore: true, maxVisible: 5, options: [{value: 'digitalIc', label: '数字IC'}, {value: 'analogIc', label: '模拟IC'}, {value: 'rfIc', label: '射频IC'}, {value: 'powerMgmt', label: '电源管理'}, {value: 'mems', label: 'MEMS'}] },{ id: 'collaborationType', label: '合作模式', allowMore: false, options: [{value: 'jointDev', label: '联合开发'}, {value: 'techTransfer', label: '技术转让'}, {value: 'consulting', label: '技术咨询'}] }],
  testingValidation: [ /* ... as before ... */ { id: 'testType', label: '测试类型', allowMore: true, maxVisible: 5, options: [{value: 'reliability', label: '可靠性测试'}, {value: 'performance', label: '性能测试'}, {value: 'failureAnalysis', label: '失效分析'}] },{ id: 'equipment', label: '设备平台', options: [{value: 'ate', label: 'ATE'}, {value: 'probeStation', label: '探针台'}] }],
  industryReport: [ // **** NEW FILTER CONFIG FOR INDUSTRY REPORTS ****
    {
      id: 'reportType', label: '行业报告类型', allowMore: true, maxVisible: 5,
      options: [
        { value: 'semiconductorManufacturing', label: '半导体制造' },
        { value: 'icDesign', label: '集成电路设计' },
        { value: 'packagingTesting', label: '封装测试' },
        { value: 'semiconductorEquipment', label: '半导体设备' },
        { value: 'semiconductorMaterials', label: '半导体材料' },
        { value: 'marketAnalysis', label: '市场分析' },
        { value: 'policyResearch', label: '政策研究' }
      ]
    },
    { // Optional: Year filter for reports
      id: 'publishYear', label: '发布年份', allowMore: false,
      options: [
        { value: '2025', label: '2025年' },
        { value: '2024', label: '2024年' },
        { value: '2023', label: '2023年' },
        { value: '2022', label: '2022年' }
      ]
    }
  ],
};

const currentFilterConfig = computed(() => filterConfigs[activeTabKey.value] || []);

const currentDemandDataHookInstance = ref(null);

function initializeDemandDataForTab(tabKey) {
  const tabInfo = pageTabs.value.find(t => t.key === tabKey);
  if (tabInfo && tabInfo.usesDemandHook) {
    // TODO: Adjust pageSize for industryReport if needed (e.g., fewer items per page for list view)
    const pageSizeForHook = tabKey === 'industryReport' ? 6 : 9; // Example: 6 for reports, 9 for others
    currentDemandDataHookInstance.value = useDemandData(tabKey);
    currentDemandDataHookInstance.value.pagination.pageSize = pageSizeForHook; // Set page size on the hook instance
    currentDemandDataHookInstance.value.loadItems();
  } else {
    currentDemandDataHookInstance.value = null;
  }
}

watch(activeTabKey, async (newTabKey) => {
  currentDemandDataHookInstance.value = null;
  await nextTick();
  if (filterPanelRef.value && typeof filterPanelRef.value.resetFiltersAndSearch === 'function') {
    filterPanelRef.value.resetFiltersAndSearch();
  }
  initializeDemandDataForTab(newTabKey);
}, { immediate: true });

const handleFiltersUpdated = (filters, searchTerm) => {
  if (currentDemandDataHookInstance.value) {
    currentDemandDataHookInstance.value.updateFiltersAndSearch(filters, searchTerm);
  }
};
const handleSearchTermApplied = (searchTerm, currentActiveFilters) => {
  if (currentDemandDataHookInstance.value) {
    currentDemandDataHookInstance.value.updateFiltersAndSearch(currentActiveFilters, searchTerm);
  }
};
const handleTabChange = (newKey) => activeTabKey.value = newKey;
const handlePageChange = (page) => {
  if (currentDemandDataHookInstance.value) currentDemandDataHookInstance.value.changePage(page);
};

const createRequest = () => {
  // ... (same as before) ...
  const currentTabName = getTabName(activeTabKey.value);
  console.log(`Create new request for tab: ${currentTabName} (${activeTabKey.value})`);
  alert(`即将创建 "${currentTabName}" 请求...`);
};

</script>

<style scoped lang="less">
// Styles remain the same as your previous DemandSquarePage.vue version
@import '@/assets/styles/_variables.less';

.demand-square-page {
  background-color: @background-color-light-gray;
  min-height: calc(100vh - @layout-header-height - @layout-footer-height);
}

.demand-hero-section {
  background-color: lighten(@primary-color, 40%);
  padding: 40px 0;
  text-align: center;
  color: @text-color-base;
  margin-bottom: 0;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: @spacing-xs;
    color: darken(@primary-color, 10%);
  }
  p {
    font-size: 15px;
    color: @text-color-secondary;
    max-width: 600px;
    margin: 0 auto;
  }
}

.page-content-container {
  padding-top: 0;
  padding-bottom: @spacing-xl;
}
.tab-content-wrapper {
    // No specific styles needed for wrapper itself usually
}

.content-section {
  margin-bottom: @spacing-lg;
  &:last-child {
    margin-bottom: 0;
  }
}
.filter-panel-wrapper.content-section {
    margin-top: @spacing-lg;
}


.results-summary-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

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
    border-color: @primary-color;
    .anticon {
      margin-right: @spacing-xs;
    }
  }
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: @spacing-lg;

   @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
    @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
}

.loading-spinner, .no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}
.no-results {
  background-color: @background-color-base;
  padding: @spacing-xl;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
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
  min-height: 250px;
  background-color: @background-color-base;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
</style>