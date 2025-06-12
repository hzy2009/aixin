<template>
  <div class="multi-date-range-picker-group">
    <div
      v-for="pickerConfig in config"
      :key="pickerConfig.field"
      class="date-picker-item"
    >
      <span v-if="pickerConfig.label" class="picker-label">{{ pickerConfig.label }}：</span>
      <a-range-picker
        v-model:value="dateRanges[pickerConfig.field]"
        :placeholder="pickerConfig.placeholder || ['开始日期', '结束日期']"
        :value-format="pickerConfig.valueFormat || 'YYYY-MM-DD'"
        :format="pickerConfig.displayFormat || pickerConfig.valueFormat || 'YYYY-MM-DD'"
        @change="() => onDateChange()"
        class="custom-picker-input"
        :allow-clear="pickerConfig.allowClear === undefined ? true : pickerConfig.allowClear"
        :disabled="pickerConfig.disabled"
        :disabled-date="pickerConfig.disabledDate"
        :inputReadOnly="true"
      >
        <template #suffixIcon><CalendarOutlined class="picker-icon-style" /></template>
      </a-range-picker>
    </div>
  </div>
</template>

<script setup>
import { watch, reactive } from 'vue';
import { RangePicker as ARangePicker } from 'ant-design-vue';
import { CalendarOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  config: {
    type: Array,
    required: true,
    default: () => []
  },
});

const emit = defineEmits(['valuesChanged']);

const dateRanges = reactive({});

const initializeOrUpdateDateRanges = (newConfig) => {
  const existingFields = Object.keys(dateRanges);
  const newFields = newConfig.map(c => c.field);

  existingFields.forEach(field => {
    if (!newFields.includes(field)) {
      delete dateRanges[field];
    }
  });

  newConfig.forEach(pickerConfig => {
    if (!dateRanges.hasOwnProperty(pickerConfig.field)) {
      dateRanges[pickerConfig.field] = [];
    }
  });
};



const onDateChange = () => {
  const currentValues = {};
  for (const key in dateRanges) {
    // Ensure dateRanges[key] is an array, even if empty
    const rangeArray = Array.isArray(dateRanges[key]) ? dateRanges[key] : [];

    // If a date range is selected (array has two elements)
    if (rangeArray && rangeArray.length === 2) {
      currentValues[`${key}_begin`] = rangeArray[0];
      currentValues[`${key}_end`] = rangeArray[1];
    } else {
      // If not selected or partially selected, send null or undefined for begin/end
      // Or send empty strings, depending on how backend prefers to receive cleared dates
      currentValues[`${key}_begin`] = null; // Or ''
      currentValues[`${key}_end`] = null;   // Or ''
    }
  }
  emit('valuesChanged', currentValues);
};

watch(() => props.config, (newConfig) => {
  initializeOrUpdateDateRanges(newConfig);
  onDateChange();
}, {
  deep: true,
  immediate: true
});
const resetAllDates = () => {
  props.config.forEach(pickerConfig => {
    dateRanges[pickerConfig.field] = [];
  });
  onDateChange();
};

defineExpose({ resetAllDates, getCurrentValues: () => {
    const currentFormattedValues = {};
    for (const key in dateRanges) {
        const rangeArray = Array.isArray(dateRanges[key]) ? dateRanges[key] : [];
        if (rangeArray && rangeArray.length === 2) {
            currentFormattedValues[`${key}_begin`] = rangeArray[0];
            currentFormattedValues[`${key}_end`] = rangeArray[1];
        } else {
            currentFormattedValues[`${key}_begin`] = null;
            currentFormattedValues[`${key}_end`] = null;
        }
    }
    return currentFormattedValues;
}});

</script>

<style scoped lang="less">
// Styles remain exactly the same as the previous version
@import '@/assets/styles/_variables.less';

.multi-date-range-picker-group {
  padding: 16px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: @spacing-xl;
  border-bottom: 1px dotted #e0e0e0;
}

.date-picker-item {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.picker-label {
  font-size: 14px;
  color: @text-color-secondary;
  margin-right: @spacing-sm;
  white-space: nowrap;
}

.custom-picker-input {
  width: 260px;
  height: 36px;
  border-radius: @border-radius-sm;
  border: 1px solid #E3E3E3;
  font-size: 13px;

  &:hover {
    border-color: @primary-color;
  }
  &.ant-picker-focused,
  &:focus-within {
    border-color: @primary-color;
    box-shadow: 0 0 0 2px fade(@primary-color, 20%);
  }

  :deep(.ant-picker-input > input) {
    font-size: 13px;
    &::placeholder {
        color: #BFBFBF;
    }
  }
  :deep(.ant-picker-range-separator .ant-picker-separator) {
    color: #BFBFBF;
  }
  .picker-icon-style.anticon-calendar {
    color: #BFBFBF;
    font-size: 14px;
  }
}
:deep(.ant-picker-range .ant-picker-active-bar){
  background: @primary-color; 
}
</style>