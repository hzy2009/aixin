<template>
    <div class="page-tabs-container">
      <div class="container">
        <a-tabs
          :activeKey="activeKey"
          @change="onTabChange"
          class="main-category-tabs"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.key"
            :tab="tab.label"
          ></a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
  
  defineProps({
    tabs: {
      type: Array,
      required: true,
      default: () => [] // e.g., [{ key: 'alternativeSourcing', label: '国产替代寻源' }, ...]
    },
    activeKey: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['tabChange']);
  
  const onTabChange = (key) => {
    emit('tabChange', key);
  };
  </script>
  
  <style scoped lang="less">
  @import '@/assets/styles/_variables.less';
  
  .page-tabs-container {
    background-color: @background-color-base;
    border-bottom: 1px solid @border-color-light;
    margin-bottom: @spacing-lg; // Keep space before content
  }
  
  // Styles for .main-category-tabs are copied from DemandSquarePage.vue
  // and slightly adjusted for reusability if needed.
  .main-category-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
      &::before {
        display: none;
      }
    }
    :deep(.ant-tabs-nav-list) {
      border-left: 1px solid @border-color-light;
    }
    :deep(.ant-tabs-tab) {
      height: 60px;
      padding: 0 37px;
      margin: 0 !important;
      font-size: 16px;
      font-weight: 500;
      color: @text-color-base;
      background-color: @background-color-base;
      border-right: 1px solid @border-color-light;
      transition: background-color 0.2s ease, color 0.2s ease;
      border-bottom: none !important;
  
      .ant-tabs-tab-btn {
        transition: color 0.2s ease;
      }
      &:hover {
        color: @primary-color;
        background-color: #f7f7f7;
      }
    }
    :deep(.ant-tabs-tab-active) {
      background-color: @primary-color !important;
      border-right-color: @primary-color !important;
      .ant-tabs-tab-btn {
        color: @text-color-light !important;
        font-weight: 600;
      }
      &:hover {
        background-color: @primary-color !important;
        .ant-tabs-tab-btn {
          color: @text-color-light !important;
        }
      }
    }
    :deep(.ant-tabs-ink-bar) {
      display: none !important;
    }
  }
  </style>