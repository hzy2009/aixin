<template>
  <div class="stats-bar">
    <div v-for="stat in stats" :key="stat.label" class="stat-item">
      <div class="stat-item__icon-wrapper">
        <!-- TODO: Add actual icon component or <img> here based on stat.iconSrc -->
        <img v-if="stat.iconSrc" :src="stat.iconSrc" :alt="stat.label" class="stat-icon-img" />
        <component v-else :is="stat.iconComponent" class="stat-icon-antd" />
      </div>
      <div class="stat-item__info">
        <div class="stat-item__label">{{ stat.label }}</div>
        <div class="stat-item__value" :style="{ color: stat.color || 'inherit' }">{{ stat.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PictureOutlined } from '@ant-design/icons-vue'; // Example default icon

defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => [
      // Example structure:
      // { label: '未响应', value: 0, iconSrc: 'path/to/icon.png', color: '#fadb14' },
      // { label: '进行中', value: 0, iconComponent: SomeAntdIcon, color: '#1890ff' },
    ]
  }
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.stats-bar {
  display: flex;
  gap: @spacing-lg;
  padding: @spacing-lg;
  background-color: @background-color-base; // Or a slightly different shade like #f9f9f9
  border-radius: @border-radius-base;
  // margin-bottom: @spacing-lg; // Parent will handle margin via .content-section
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: @background-color-light-gray; // Background for each stat box
  padding: @spacing-md @spacing-lg;
  border-radius: @border-radius-sm;
  // border: 1px solid @border-color-light;

  &__icon-wrapper {
    margin-right: @spacing-md;
    width: 48px; // Adjust size as needed
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: fade(@primary-color, 10%); // Example icon bg
    // border-radius: 50%;

    .stat-icon-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .stat-icon-antd {
      font-size: 32px; // Adjust AntD icon size
      color: @primary-color; // Example color
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-size: 14px;
    color: @text-color-secondary;
    margin-bottom: @spacing-xs;
  }

  &__value {
    font-size: 24px;
    font-weight: 700;
    color: @text-color-base; // Default value color
    line-height: 1;
  }
}
</style>