<template>
  <BaseSidebar
    :current-report-id="props.currentReportId"
    :category="props.category"
    :count="props.count"
    :code="props.code"
    variant="public"
    api-url="/apm/apmRdBreakthrough/list/front"
    route-prefix="/demands/PublicRelationsDetailPage"
    empty-description="暂无相关攻关项目"
    @report-click="handleReportClick"
    @item-click="handleItemClick"
  />
</template>

<script setup>
import BaseSidebar from '@/components/common/BaseSidebar.vue';

const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
});

const handleReportClick = () => {
  // 可以添加额外的处理逻辑
};

const handleItemClick = (item) => {
  // 可以添加额外的处理逻辑
  console.log('Public relations item clicked:', item);
};
</script>

<style scoped lang="less">
// 样式已统一到 BaseSidebar 组件中
</style>