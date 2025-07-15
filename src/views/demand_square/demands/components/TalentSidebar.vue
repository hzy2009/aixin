<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading || !props.code" class="loading-placeholder">
      <a-skeleton active :paragraph="{ rows: 4 }" v-for="i in skeletonCount" :key="`ske-${i}`" class="skeleton-item" />
    </div>
    <div v-else-if="tableData.length > 0" class="reports-list-items">
      <router-link v-for="item in tableData.slice(0, props.count)" :key="item.id"
        :to="`/demands/TalentDetailPage/${item.id}`" class="report-item-link" @click="handleReportClick">
        <div class="report-item-content">
    
          <h2 class="report-item-title">
            <img src="@/assets/images/auth/avatar.png" alt="">
            <span>{{ item.code }}</span>
            <ArrowRightOutlined class="arrow-icon" />
          </h2>
          <p class="report-item-title">{{ item.skillAreaName }}</p>
          <p class="report-item-meta">意愿合作方向：{{ item.skillDesc }}</p>
          <p class="report-item-meta">主要研究方向：{{ item.skillDesc }}</p>
        <!-- <div class="report-item-footer report-item-summary">
            <span>期望匹配周期：{{ item.matchPeriodName }}</span>
            <ArrowRightOutlined class="arrow-icon" />
          </div> -->
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

const props = defineProps({
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
});

const emit = defineEmits(['reportClick']);

const skeletonCount = computed(() => props.count); // For skeleton loader

const {
  isLoading,
  tableData,
  loadTableData
} = useUserDemandList({
  url: {
    list: '/apm/apmTalent/list/front',
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
  )
})
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