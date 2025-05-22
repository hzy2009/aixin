<template>
  <div class="common-search-input">
    <a-input-search
      v-model:value="internalSearchTerm"
      :placeholder="placeholder"
      :loading="loading"
      @search="onSearch"
      @change="onInputChange"
      allow-clear
    >
      <template #enterButton>
        <a-button type="primary">
          <SearchOutlined /> {{ buttonText }}
        </a-button>
      </template>
    </a-input-search>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { InputSearch as AInputSearch, Button as AButton } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  modelValue: { // For v-model binding from parent
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入关键字'
  },
  buttonText: {
    type: String,
    default: '搜索'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const internalSearchTerm = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalSearchTerm.value) {
    internalSearchTerm.value = newValue;
  }
});

const onSearch = (value, event) => {
  // event can be undefined if cleared or changed programmatically
  // Only emit search if it's a real search event (button click or enter)
  if (event) {
     emit('update:modelValue', value);
     emit('search', value);
  }
};
const onInputChange = (e) => {
    // If you want live updates on modelValue as user types:
    // emit('update:modelValue', e.target.value);
    // For now, modelValue is updated mainly on search trigger
}
</script>

<style scoped lang="less">
.common-search-input {
  display: flex;
  width: 100%; // Or a max-width depending on usage context
  max-width: 400px; // Example max-width

  :deep(.ant-input-search .ant-input) {
    height: 36px; // Match button height
  }
  :deep(.ant-btn) {
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
     .anticon + span {
         margin-left: 6px;
     }
  }
}
</style>