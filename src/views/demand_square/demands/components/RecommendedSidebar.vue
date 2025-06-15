<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading" class="loading-placeholder">
      <a-skeleton active :paragraph="{ rows: 4 }" v-for="i in skeletonCount" :key="`ske-${i}`" class="skeleton-item" />
    </div>
    <div v-else-if="recommendedReports.length > 0" class="reports-list-items">
      <router-link v-for="report in recommendedReports" :key="report.id"
        :to="`/demands/IndustryReportDetailPage/${report.id}`" class="report-item-link">
        <div class="report-item-content">
          <h4 class="report-item-title">{{ report.reportName }}</h4>
          <p class="report-item-meta">领域：{{ report.reportTypeName }}</p>
          <p class="report-item-summary">摘要：{{ report.description }}</p>
          <div class="report-item-footer">
            <span class="report-item-price">¥ {{ report.unitPrice }}</span>
            <RightOutlined class="arrow-icon" />
          </div>
        </div>
      </router-link>
    </div>
    <a-empty v-else description="暂无相关报告" class="empty-state" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Skeleton as ASkeleton, Empty as AEmpty } from 'ant-design-vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { useUserDemandList } from '@/components/template/hooks/useUserDemandList.js'; // Adjust path
// import apiClient from '@/api';

const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 }
});

const skeletonCount = computed(() => props.count); // For skeleton loader

const {
  isLoading,
  tableData: recommendedReports,
} = useUserDemandList({
  url: {
    list: '/apm/apmResearchReport/list/front',
  },
});

// async function fetchRecommendedReports() {
//   isLoading.value = true;
//   try {
//     // TODO: API Call
//     // const response = await apiClient.get('/api/reports/recommended', { params: { /* ... */ } });
//     // recommendedReports.value = response.data.items;

//     // --- Mock Data ---
//     await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
//     const mockItems = [
//       { id: `rec-${props.currentReportId || ''}-001`, title: '报告标题报告标题报告标题报告标题报告标题...', domain: '光催化分解水;异质结;过渡金属硫', summary: '直接利用太阳能实现光催化还原制取氢气，是解决能源危机的有效策略之一。过渡金属硫化物具有优异的可见', price: 198 },
//       { id: `rec-${props.currentReportId || ''}-002`, title: '另一份相关行业分析报告标题示例长一点看看效果', domain: 'AI芯片;市场分析', summary: '这份报告深入探讨了人工智能芯片市场的最新发展和未来趋势，为投资者提供决策依据。', price: 288 },
//       { id: `rec-${props.currentReportId || ''}-003`, title: '第三代半导体材料与应用前景展望', domain: '新材料;半导体器件', summary: '探索碳化硅（SiC）和氮化镓（GaN）等第三代半导体材料的特性及其在电力电子、射频通信等领域的应用。', price: 198 },
//       { id: `rec-${props.currentReportId || ''}-004`, title: '测试报告第四条，用于测试数量', domain: '测试领域', summary: '这是一个测试摘要，看看多条数据时的样子。', price: 99 },
//     ];
//     recommendedReports.value = mockItems.filter(item => item.id !== props.currentReportId).slice(0, props.count);
//     // --- End Mock Data ---
//   } catch (error) {
//     console.error("获取推荐报告失败:", error);
//     recommendedReports.value = [];
//   } finally {
//     isLoading.value = false;
//   }
// }

// onMounted(fetchRecommendedReports);

// watch([() => props.currentReportId, () => props.category, () => props.count], () => {
//     fetchRecommendedReports();
// }, { deep: true }); // Use deep watch if props could be objects, though not strictly needed for primitives
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.recommended-reports-list {
  // The parent container (.sidebar-column in IndustryReportDetailPage.vue)
  // should provide the overall background and border for the sidebar area.
  // This component now only focuses on the list of items.
}

.reports-list-items {
  display: flex;
  flex-direction: column;
  // gap: @spacing-md; // Gap will be handled by report-item-link's margin or padding
}

.report-item-link {
  display: block;
  color: inherit;
  text-decoration: none;
  background-color: @background-color-base; // Each item has a white background
  padding: @spacing-lg;
  margin-bottom: @spacing-lg; // Space between items
  border: 1px solid @border-color-light; // Border for each item
  border-radius: @border-radius-sm; // Slight rounding for each item
  transition: box-shadow 0.3s ease, border-color 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: darken(@border-color-light, 5%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .report-item-title {
      color: @primary-color;
    }

    .arrow-icon {
      color: @primary-color;
      transform: translateX(4px);
    }
  }
}

.report-item-content {
  // Inner div for content if needed, or apply styles directly to link
  // No specific styles needed here if link itself handles padding and layout
}

.report-item-title {
  font-size: 16px;
  font-weight: 500;
  color: @text-color-base;
  margin-bottom: @spacing-xs;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.5em * 2);
}

.report-item-meta {
  font-size: 13px;
  color: @text-color-secondary;
  line-height: 1.6;
  margin-bottom: @spacing-xs;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-item-summary {
  font-size: 13px;
  color: @text-color-secondary;
  line-height: 1.6;
  margin-bottom: @spacing-sm;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.6em * 2);
}

.report-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: @spacing-xs;
}

.report-item-price {
  font-size: 18px;
  font-weight: bold;
  color: @primary-color;
}

.arrow-icon {
  font-size: 16px;
  color: #BFBFBF;
  transition: color 0.2s ease, transform 0.2s ease;
}

.loading-placeholder {
  .skeleton-item {
    background-color: @background-color-base;
    padding: @spacing-lg;
    margin-bottom: @spacing-lg;
    border: 1px solid @border-color-light;
    border-radius: @border-radius-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.empty-state {
  background-color: @background-color-base;
  padding: @spacing-xl;
  border: 1px solid @border-color-light;
  border-radius: @border-radius-sm;
}
</style>