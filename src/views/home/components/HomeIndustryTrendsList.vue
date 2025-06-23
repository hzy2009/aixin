<template>
  <div class="industry-trends-list-wrapper">
    <SectionHeader title-ch="行业热点" title-en="INDUSTRY TRENDS" more-link="/industry-dynamics" />
    <a-list :data-source="trends" :split="false" class="trends-list">
      <template #renderItem="{ item, index }">
        <a-list-item
          class="trend-item"
        >
          <div class="trend-item__content">
            <router-link :to="`/industry-dynamics/${item.id}`" class="trend-item__title-link">
              {{ item.title }}
            </router-link>
            <p class="trend-item__description">{{ item.description }}</p>
          </div>
          <span class="trend-item__date">{{ item.date }}</span>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { List as AList, ListItem as AListItem } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue'; // Ensure this component's styling matches the section header in the image.

const trends = ref([
  { id: 1, title: '中国半导体行业协会2025年环境、安全和健康国际研讨会...', description: '近年来，集成电路产业在成为国家重点鼓励、扶持的战略性新兴产业的同时，也日益面临着更为严峻的...', date: '2025-04-22' },
  { id: 2, title: '探索下一代芯片技术：量子计算与半导体的融合机遇', description: '随着摩尔定律逐渐接近物理极限，行业开始积极探索全新的计算范式。量子计算凭借其独特的...', date: '2025-04-20' },
  { id: 3, title: '全球供应链重塑下的国产替代加速趋势分析报告', description: '地缘政治及疫情等多重因素影响下，全球半导体供应链正经历深刻调整。本土企业迎来发展契机...', date: '2025-04-18' },
  { id: 4, title: 'AI芯片市场爆发式增长，赋能千行百业智能化转型', description: '人工智能技术的飞速发展，对算力提出了前所未有的需求。AI芯片作为核心硬件支撑，市场需求旺盛...', date: '2025-04-15' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Colors from your new spec or inferred
@trends-primary-red: @primary-color;
@trends-highlight-bg: #fff5f5; // (Keeping this from previous for first item)

@trends-title-color-default: #333333; // Default title color
@trends-title-color-highlight: @trends-primary-red;
@trends-description-color: #555555; // Description text color
@trends-date-color: #999999;       // Date text color
@trends-border-color: #E5E5E5;     // Border color from your spec

.industry-trends-list-wrapper {
  display: flex;
  flex-direction: column;
  // Height of this wrapper should be determined by its parent container
  // if it's part of a grid layout (e.g., next to a carousel).
  // If standalone and needs fixed height for scrolling:
  // height: 400px; // Example fixed height for scrolling
}

:deep(.section-header) {
  margin-bottom: @spacing-sm;
  padding-bottom: @spacing-xs;
  // Ensure SectionHeader styles are appropriate for this context
  // (as per previous refinement, or make SectionHeader more configurable)
  .section-header__title-decorator { height: 18px; margin-right: 6px;}
  .section-header__title-ch { font-size: 20px; }
  .section-header__title-en { font-size: 13px; color: #999; font-weight: 300; }
}

.trends-list {
  flex-grow: 1;
  overflow-y: auto;
  // If the list itself needs to adhere to the 690px width constraint:
  // max-width: 690px; // Or width: 690px; if it should be strictly this.
  // margin: 0 auto; // If it needs to be centered and has a fixed width.

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #dcdcdc; border-radius: 2px; }
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center; // Vertically center content within the 72px height
  height: 72px;       // Fixed height per item
  padding: 0 12px;    // Horizontal padding; vertical padding handled by fixed height and line-heights
  border-bottom: 1px solid @trends-border-color; // Solid border as per new spec
  box-sizing: border-box; // Ensure padding doesn't add to height
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover{
    background-color: @trends-highlight-bg;
    border-radius: @border-radius-sm; // Optional rounding
    .trend-item__title-link {
      color: @trends-title-color-highlight;
    }
  }
}

.trend-item__content {
  flex-grow: 1;
  padding-right: @spacing-lg; // More space between text and date
  min-width: 0; // For flex-grow to work correctly with ellipsis
  display: flex;
  flex-direction: column;
  justify-content: center; // Center title and description vertically if space allows
}

.trend-item__title-link {
  display: block;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 30px; // As per spec
  letter-spacing: 0%;
  // text-transform: uppercase; // Applied as per spec, though unusual for Chinese
  color: @trends-title-color-default;
  transition: color 0.2s ease;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trend-item__description {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px; // As per spec
  letter-spacing: 0%;
  color: @trends-description-color;
  margin: 0; // Remove default p margin

  // Ellipsis for single line of description (due to fixed height, multi-line might be tight)
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // If you absolutely need two lines and can guarantee title isn't too tall:
  // display: -webkit-box;
  // -webkit-line-clamp: 1; // Given the line-heights, 2 lines of desc might not fit with a 30px title line-height in 72px
  // -webkit-box-orient: vertical;
}

.trend-item__date {
  font-family: 'PingFang SC', sans-serif; // Assuming date also uses PingFang SC
  font-weight: 400;
  font-size: 12px; // Match description font size
  line-height: 18px; // Match description line height for alignment
  color: @trends-date-color;
  white-space: nowrap;
  flex-shrink: 0;
}

// Remove default Ant Design List Item padding
:deep(.ant-list-item) {
  padding: 0 !important;
}
</style>