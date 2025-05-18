// src/features/home/components/HomeStatsSection.vue

<template>
  <section class="home-stats-section">
    <div class="home-stats-section__content container">
      <StatItem
        v-for="stat in stats"
        :key="stat.label"
        :number="stat.number"
        :title="stat.label"
        :description="stat.description"
        class="individual-stat-item"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import StatItem from './StatItem.vue'; // Import the new component

const stats = ref([
  { number: '500+', label: '国产替代寻源', description: '寻找并采用\n国内企业生产的芯片或相关技术\n以替代原本依赖的进口产品' },
  { number: '360+', label: '原厂件寻源', description: '通过正规渠道获取\n直接生产或授权的正品元器件' },
  { number: '78+', label: '研发攻关', description: '集中资源突破关键技术瓶颈\n或解决复杂问题' },
  { number: '180+', label: '检测验证', description: '通过系统化测试与分析\n确保芯片设计、制造等环节\n符合各种要求' },
  { number: '50+', label: '线下沙龙', description: '专家分享、实践互动\n促进行业合作与发展' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.home-stats-section {
  padding: @spacing-xl 0;
  background-color: @background-color-base;

  &__content {
    display: flex;
    flex-wrap: wrap; // Allow wrapping on smaller screens
  }
}

// This class is applied to the StatItem component instance in the template
.individual-stat-item {
  // If you use a grid layout for HomeStatsSection__content,
  // StatItem will take the cell width.
  // If using flex, you might want to control its basis or max-width here.
  // For example, to ensure 5 items fit well:
  // flex-basis: calc(20% - @spacing-md); // Adjust based on gap and desired items per row
  flex: 1;
  min-width: 180px; // Minimum width before it gets too squeezed
  max-width: 240px; // Optional max width

  @media (max-width: 1200px) {
    flex-basis: calc(33.33% - @spacing-md);
  }
  @media (max-width: 768px) {
    flex-basis: calc(50% - @spacing-md);
  }
  @media (max-width: 576px) {
    flex-basis: 100%;
  }
}
</style>