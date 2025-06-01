<template>
  <div class="user-stat-card">
    <div class="stat-card__icon">
      <!-- Placeholder for icon - parent will pass actual icon or image -->
      <slot name="icon">
      </slot>
    </div>
    <div class="stat-card__content">
      <div class="stat-card__label">{{ label }}</div>
      <div class="stat-card__value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  // iconSrc: { type: String, default: '' } // Alternative if not using slot
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-stat-card {
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: @background-color-base; // Assuming cards are on a slightly off-white bg
  padding: @spacing-md @spacing-sm;
  border-radius: @border-radius-base;
  // box-shadow: 0 1px 3px rgba(0,0,0,0.04); // Very subtle shadow
  border: 1px solid @border-color-light;
  gap: @spacing-sm;
  flex: 1; // To make cards distribute space in a flex container
  min-width: 140px; // Minimum width for a stat card
}

.stat-card__icon {
  img {
    width: 48px; // Adjust size as per your icons
    height: 48px;
    object-fit: contain;
  }
  // Or if using AntD icons via slot:
  :deep(.anticon) {
    font-size: 32px;
    color: @primary-color; // Example color
  }
}

.stat-card__content {
  display: flex;
  flex-direction: column;
}

.stat-card__label {
  font-size: 14px;
  color: @text-color-secondary;
  margin-bottom: @spacing-xs;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: @text-color-base;
  line-height: 1.1;
}
</style>