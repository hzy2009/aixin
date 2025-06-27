<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading" class="loading-placeholder">
      <a-skeleton active :paragraph="{ rows: 4 }" v-for="i in skeletonCount" :key="`ske-${i}`" class="skeleton-item" />
    </div>
    <div v-else-if="recommendedReports.length > 0" class="reports-list-items" >
      <router-link v-for="report in recommendedReports.slice(0, props.count)" :key="report.id" @click="handleReportClick"
        :to="`/demands/IndustryReportDetailPage/${report.id}`" class="report-item-link">
        <div class="report-item-content">
          <h4 class="report-item-title">{{ report.reportName }}</h4>
          <p class="report-item-meta">领域：{{ report.reportTypeName }}</p>
          <p class="report-item-meta">摘要：{{ report.description }}</p>
          <div class="report-item-description">
            <div v-html="report.description"></div>
          </div>
          <div class="report-item-footer">
            <span class="report-item-price"><span class="currency-symbol">¥</span> {{ report.unitPrice }}</span>
            <ArrowRightOutlined class="arrow-icon" />
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
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { useUserDemandList } from '@/components/template/hooks/useUserDemandList.js'; // Adjust path

const emit = defineEmits(['reportClick']);

const props = defineProps({
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
const handleReportClick = () => {
  emit('reportClick');
}

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
  padding: 17px 20px;
  margin-bottom: 20px; // Space between items
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
      transform: translateX(-4px);
    }
  }
}

.report-item-content {
  // Inner div for content if needed, or apply styles directly to link
  // No specific styles needed here if link itself handles padding and layout
}

.report-item-title {
  margin-bottom: 10px;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #272A30;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.5em * 1);
}

.report-item-meta {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: justify;
  color: #656C74;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-item-summary {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: justify;
  color: #656C74;
  margin-bottom: @spacing-sm;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.6em * 2);
}
.report-item-description{
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: justify;
  color: #656C74;
  height: 66px;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.report-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: @spacing-xs;
}

.report-item-price {
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;

  color: @primary-color;
  .currency-symbol{
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 12px;
    letter-spacing: 0%;
    text-transform: uppercase;
  }
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