<template>
  <BaseSidebar
    :current-report-id="props.currentReportId"
    :category="props.category"
    :count="props.count"
    :code="props.code"
    variant="report"
    api-url="/apm/apmResearchReport/list/front"
    route-prefix="/demands/IndustryReportDetailPage"
    empty-description="暂无相关报告"
    @report-click="handleReportClick"
    @item-click="handleItemClick"
  />
</template>

<script setup>
import BaseSidebar from '@/components/common/BaseSidebar.vue';

const emit = defineEmits(['reportClick']);

const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
});

const handleReportClick = () => {
  emit('reportClick');
};

const handleItemClick = (item) => {
  // 可以添加额外的处理逻辑
  console.log('Report clicked:', item);
};
</script>

<style scoped lang="less">
// 样式已统一到 BaseSidebar 组件中
</style>