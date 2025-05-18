<template>
  <section class="home-industry-trends-section section-padding">
    <div class="container">
      <SectionHeader title-ch="行业动态" title-en="INDUSTRY TRENDS" more-link="/industry-dynamics" />
      <a-list item-layout="horizontal" :data-source="trends" :split="false" class="trends-list">
        <template #renderItem="{ item }">
          <a-list-item class="trend-item">
            <a-list-item-meta>
              <template #title>
                <router-link :to="`/industry-dynamics/${item.id}`" class="trend-item__title">
                  {{ item.title }}
                </router-link>
              </template>
              <template #description>
                <p class="trend-item__description">{{ item.description }}</p>
              </template>
            </a-list-item-meta>
            <span class="trend-item__date">{{ item.date }}</span>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { List as AList, ListItem as AListItem, ListItemMeta as AListItemMeta } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';

const trends = ref([
  { id: 1, title: '中国半导体行业协会2025年环境、安全和健康国际研讨会...', description: '近年来，集成电路产业在成为国家重点鼓励、扶持的战略性新兴产业的同时，也日益面临着更为严峻的...', date: '2025-04-22' },
  { id: 2, title: '探索下一代芯片技术：量子计算与半导体的融合机遇', description: '随着摩尔定律逐渐接近物理极限，行业开始积极探索全新的计算范式。量子计算凭借其独特的...', date: '2025-04-20' },
  { id: 3, title: '全球供应链重塑下的国产替代加速趋势分析', description: '地缘政治及疫情等多重因素影响下，全球半导体供应链正经历深刻调整。本土企业迎来发展契机...', date: '2025-04-18' },
  { id: 4, title: 'AI芯片市场爆发式增长，赋能千行百业智能化转型', description: '人工智能技术的飞速发展，对算力提出了前所未有的需求。AI芯片作为核心硬件支撑，市场需求旺盛...', date: '2025-04-15' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding { // Reusable class for consistent section padding
  padding: 50px 0;
}

.trends-list {
  .trend-item {
    padding: @spacing-md 0;
    border-bottom: 1px dashed @border-color-base;
    transition: background-color 0.3s;

    &:last-child {
      border-bottom: none;
    }
     &:hover {
      background-color: lighten(@background-color-light-gray, 2%);
    }

    &__title {
      font-size: 17px;
      color: @text-color-base;
      font-weight: 500;
      margin-bottom: @spacing-xs;
      display: block; // Ensure it takes full width for hover effect
      &:hover {
        color: @primary-color;
      }
    }

    &__description {
      font-size: 14px;
      color: @text-color-secondary;
      line-height: 1.6;
      // Simple text truncation
      display: -webkit-box;
      -webkit-line-clamp: 1; // Show only 1 line
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__date {
      font-size: 14px;
      color: @text-color-secondary;
      white-space: nowrap; // Prevent date from wrapping
      padding-left: @spacing-md; // Space between meta and date
    }
  }
  // Override antd list item padding if necessary
  :deep(.ant-list-item-meta) {
    margin-bottom: 0;
  }
  :deep(.ant-list-item) {
    padding-top: @spacing-sm;
    padding-bottom: @spacing-sm;
  }
}
</style>