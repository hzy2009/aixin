<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading || !props.code" class="loading-placeholder">
      <a-skeleton active :paragraph="{ rows: 4 }" v-for="i in skeletonCount" :key="`ske-${i}`" class="skeleton-item" />
    </div>
    <div v-else-if="tableData.length > 0" class="reports-list-items">
      <router-link v-for="item in tableData.slice(0, props.count)" :key="item.id"
        :to="`/demands/PublicRelationsDetailPage/${item.id}`" class="report-item-link">
        <div class="report-item-content">
          <h2 class="report-item-title">{{ item.code }}</h2>
          <p class="report-item-meta fontSizeitem">研发攻关类型：{{ item.rdType }}</p>
          <div class="report-item-footer report-item-summary fontSizeitem">
            <span>期望完成日期：{{ item.expireDate ? formatDate(item.expireDate) : '' }}</span>
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
import { formatDate } from '@/utils'; // 请确保此路径正确
// import apiClient from '@/api';

const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
});

const skeletonCount = computed(() => props.count); // For skeleton loader

const {
  isLoading,
  tableData,
  loadTableData,
} = useUserDemandList({
  url: {
    list: '/apm/apmRdBreakthrough/list/front',
  },
  otherParams: {
    code: `!${props.code}`
  },
})
watch(() => props.code, () => {
  if (!props.code) return
  loadTableData(
    {
      code: `!${props.code}`
    }
  );
})

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';
@import './sidebar.less';

</style>