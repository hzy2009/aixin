<template>
  <div class="content-with-sidebar-layout">
    <div class="container layout-container">
      <div class="main-content-area">
        <slot name="main"></slot>
      </div>
      <aside class="sidebar-area">
        <slot name="sidebar"></slot>
      </aside>
    </div>
  </div>
</template>

<script setup>
// No specific script needed for this simple layout component
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.content-with-sidebar-layout {
  background-color: @background-color-light-gray; // Overall page background
  padding: @spacing-lg 0 @spacing-xxl 0; // Top and bottom padding for the whole page
}

.layout-container {
  display: flex;
  gap: @spacing-lg; // Gap between main content and sidebar

  @media (max-width: 992px) {
    // Tablet and below, stack them
    flex-direction: column;
  }
}

.main-content-area {
  flex: 1; // Takes up most of the space
  min-width: 0; // Important for flex item to prevent overflow
  background-color: #f8f9fa; // White background for main content
}

.sidebar-area {
  width: 300px; // Fixed width for sidebar
  flex-shrink: 0;

  @media (max-width: 992px) {
    width: 100%; // Full width when stacked
  }
}
</style>