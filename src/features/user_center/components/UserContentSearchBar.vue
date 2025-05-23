<template>
  <div class="user-content-search-bar">
    <a-input
      v-model:value="internalSearchTerm"
      :placeholder="placeholder"
      allow-clear
      class="search-input"
      @pressEnter="handleSearch"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>
    <a-button type="primary" @click="handleSearch" class="search-button">
      搜索
    </a-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Input as AInput, Button as AButton } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  modelValue: { type: String, default: '' }, // For v-model usage
  placeholder: { type: String, default: '请输入关键字' }
});

const emit = defineEmits(['update:modelValue', 'search']);

const internalSearchTerm = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  internalSearchTerm.value = newValue;
});

watch(internalSearchTerm, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleSearch = () => {
  emit('search', internalSearchTerm.value);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-content-search-bar {
  display: flex;
  align-items: center;
  gap: @spacing-sm;

  .search-input {
    // flex-grow: 1; // Allow input to take available space
    width: 300px; // Or a fixed width as per design
    border-radius: @border-radius-base;
     :deep(.ant-input) { // Target the actual input element for padding
         padding-left: @spacing-xs;
     }
  }
  .search-button {
    // Standard button style
  }
}
</style>