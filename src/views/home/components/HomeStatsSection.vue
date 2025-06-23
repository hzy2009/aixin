<template>
  <section class="home-stats-section">
    <div class="home-stats-section__content container">
      <StatItem v-for="stat in stats" :key="stat.label" :number="stat.number" :title="stat.label"
        :description="stat.description" class="individual-stat-item" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import StatItem from './StatItem.vue'; // Import the new component

const stats = ref([
  { number: '500+', label: '国产替代寻源', description: `丰富的厂商数据库、产品数据库\n颗粒度足够细，实用性足够高\n权威性足够强`},
  { number: '360+', label: '原厂件寻源', description: '汇集行业内有能力的贸易商\n在线竞价，快速反馈及促成交易' },
  { number: '78+', label: '研发攻关', description: '需求匹配、项目跟踪\n厂商赋能、项目申报' },
  { number: '180+', label: '检测验证', description: '拉通需求、标准、方案\n加速验证，降低直接上线风险' },
  { number: '50+', label: '线下沙龙', description: '供需对接会、技术对接会\n精准、高效、快速匹配需求' },
]);
</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.home-stats-section {
  z-index: 1;
  position: relative;
  margin-top: -30px;
  // padding: @spacing-xl 0;
  // background-color: @background-color-base;

  &__content {
    display: flex;
    flex-wrap: wrap; // Allow wrapping on smaller screens
    gap: 6px;
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
  max-width: 235px; // Optional max width

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