<template>
  <div class="stats-summary-bar">
    <div v-for="stat in stats" :key="stat.label" class="stat-item">
      <div class="stat-item__icon">
        <!-- TODO: Replace with actual icon/image based on stat.iconName or similar prop -->
        <component v-if="stat.icon" :is="stat.icon" class="icon-component" />
        <img v-else-if="stat.imageUrl" :src="stat.imageUrl" alt="" class="icon-image" />
        <FileProtectOutlined v-else class="icon-component" /> <!-- Default icon -->
      </div>
      <div class="stat-item__info">
        <div class="stat-item__label">{{ stat.label }}</div>
        <div class="stat-item__value">{{ stat.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileProtectOutlined } from '@ant-design/icons-vue'; // Example default icon
// Import other icons if you pass them as components:
// import { SyncOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons-vue';

defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => [
      // Example structure:
      // { label: '未响应', value: 0, iconName: 'HourglassOutlined' or imageUrl: 'path/to/image.png' },
      // { label: '进行中', value: 0, icon: SyncOutlined },
    ]
  }
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.stats-summary-bar {
  display: flex;
  gap: @spacing-lg;
  margin-bottom: @spacing-lg;
  background-color: #fff; // White background for the bar
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: @spacing-md;
  // background-color: @background-color-light-gray; // Lighter background for each item
  // border-radius: @border-radius-sm;
  // border: 1px solid @border-color-light;

  &__icon {
    margin-right: @spacing-md;
    // TODO: Style your icon/image container
    .icon-component {
      font-size: 32px; // Adjust size
      color: @primary-color; // Or derive from stat type
    }
    .icon-image {
      width: 40px; // Adjust size
      height: 40px;
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
    font-weight: 600;
    color: @text-color-base;
  }
}
</style>