<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading || !props.code" class="loading-placeholder">
      <a-skeleton active :paragraph="{ rows: 4 }" v-for="i in skeletonCount" :key="`ske-${i}`" class="skeleton-item" />
    </div>
    <div v-else-if="tableData.length > 0" class="reports-list-items">
      <router-link v-for="item in tableData.slice(0, props.count)" :key="item.id"
        :to="`/demands/VerificationDetailPage/${item.id}`" class="report-item-link">
        <div class="report-item-content">
          <h2 class="report-item-title">{{ item.code }}</h2>
          <p class="report-item-meta fontSizeitem">产品类别：{{ getSelectDisplayValue(item.productType, 'product_type') }}</p>
          <p class="report-item-meta fontSizeitem">检测验证类别：{{ getSelectDisplayValue(item.projectType, 'project_type') }}</p>
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
// import apiClient from '@/api';
import {selectOptions, formatDate} from '@/utils/index';

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
    list: '/apm/apmInspection/list/front',
  },
  otherParams: {
    code: `!${props.code}`
  },
})
const getSelectDisplayValue = (value, dictKey) => {
	let optionsList = selectOptions(dictKey)
  const option = optionsList.find(opt => opt.value === value);
  return option ? option.label : (value || '-');
}

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