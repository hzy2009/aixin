<template>
  <BaseSidebar
    :currentReportId="props.currentReportId"
    :category="props.category"
    :count="props.count"
    :code="props.code"
    variant="talent"
    apiUrl="/apm/apmTalent/list/front"
    routePrefix="/demands/TalentDetailPage"
    emptyDescription="暂无相关报告"
    @reportClick="handleReportClick"
  />
</template>

<script setup>
import BaseSidebar from '@/components/common/BaseSidebar.vue';

// 保持与原组件完全相同的props接口
const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
});

// 保持与原组件完全相同的events接口
const emit = defineEmits(['reportClick']);

const handleReportClick = () => emit('reportClick');

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.recommended-reports-list {
  width: 282px;
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
  font-size: 16px;
  font-weight: 500;
  color: @text-color-base;
  margin-bottom: @spacing-xs;
  line-height: 1.5;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // -webkit-box-orient: vertical;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // min-height: calc(1.2em * 2);
  margin-bottom: 10px;
  img{
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.report-item-title{
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #272A30;
}

.report-item-meta {
  color: @text-color-secondary;
  margin-bottom: @spacing-xs;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: justify;
  display: -webkit-box;
  color: #656C74;
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
  min-height: calc(1.2em * 2);
}

.report-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: @spacing-xs;
}

.arrow-icon {
  font-size: 16px;
  color: #BFBFBF;
  transition: color 0.2s ease, transform 0.2s ease;
  margin-left: 60px;
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