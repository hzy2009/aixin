<template>
  <BaseSidebar
    :currentReportId="props.currentReportId"
    :category="props.category"
    :count="props.count"
    :code="props.code"
    variant="oem"
    apiUrl="/apm/apmSourcingOriginSubstitute/material/list/front"
    sourcingType="跨境采购"
    routePrefix="/demands/OEMPartsDetailPage"
    emptyDescription="暂无相关报告"
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
</script>

<style scoped lang="less">
// 样式已迁移到BaseSidebar中，保持完全兼容
</style>