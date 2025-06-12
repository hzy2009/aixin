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
        :value-format="pickerConfig.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        :format="pickerConfig.displayFormat || pickerConfig.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
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
import { watch, reactive, onUnmounted } from 'vue';
import { RangePicker as ARangePicker } from 'ant-design-vue';
import { CalendarOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  // Configuration array for the date pickers
  // Example: [{ field: 'requestDate', label: '提出需求日期' }, { field: 'completionDate', label: '计划完成日期' }]
  config: {
    type: Array,
    required: true,
    default: () => []
  },
  // Optional: If parent wants to programmatically set values after mount
  // This would require a watcher and potentially merging logic.
  // For simplicity based on your request, we are omitting direct two-way binding via a prop for now.
  // Parent will control via resetAllDates or by re-creating component with new config if values need to change from parent.
});

const emit = defineEmits(['valuesChanged']); // Renamed for clarity, emits an object with all date ranges

// Reactive state to hold the v-model values for each date range picker
// Keyed by the 'field' from the config
const dateRanges = reactive({});

// Function to initialize or re-initialize dateRanges based on config
const initializeOrUpdateDateRanges = (newConfig) => {
  // Get current keys in dateRanges
  let existingFields = Object.keys(dateRanges);
  const newFields = newConfig.map(c => c.field);

  // Remove fields from dateRanges that are no longer in newConfig
  existingFields.forEach(field => {
    if (!newFields.includes(field)) {
      delete dateRanges[field];
    }
  });

  // Add new fields from newConfig or ensure existing ones are present (default to empty array)
  newConfig.forEach(pickerConfig => {
    if (!dateRanges.hasOwnProperty(pickerConfig.field)) {
      // Initialize with an empty array for AntD RangePicker's v-model
      // Or, if config provides a default value, use that:
      // dateRanges[pickerConfig.field] = pickerConfig.defaultValue || [];
      dateRanges[pickerConfig.field] = [];
    }
  });
};

// Watch for changes in the config prop to update the internal dateRanges structure
// This is important if the number or 'field' names of pickers can change dynamically.


const onDateChange = () => {
  // When any date picker changes, emit an object containing all current date ranges
  const currentValues = {};
  for (const key in dateRanges) {
    // Ensure we are only emitting valid (potentially empty) arrays
    currentValues[key] = Array.isArray(dateRanges[key]) ? [...dateRanges[key]] : [];
  }
  emit('valuesChanged', currentValues);
};

watch(() => props.config, (newConfig) => {
  initializeOrUpdateDateRanges(newConfig);
  // After re-initializing based on config, emit current (likely empty) values
  onDateChange();
}, {
  deep: true,
  immediate: true // Initialize on component mount
});

// Method to allow parent to reset all date pickers in this group
const resetAllDates = () => {
  props.config.forEach(pickerConfig => {
    dateRanges[pickerConfig.field] = []; // Reset to empty array
  });
  onDateChange(); // Emit the reset state
};

defineExpose({ resetAllDates, getCurrentValues: () => JSON.parse(JSON.stringify(dateRanges)) });

// Cleanup on unmount if necessary (though reactive objects usually handle themselves)
// onUnmounted(() => {
//   // Clean up any listeners or timers if they were used
// });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // LINE 107 in the previous full component code

.multi-date-range-picker-group { // LINE 109
  padding: 16px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: @spacing-xl; // LINE 113 - USES A VARIABLE
  border-bottom: 1px dotted #e0e0e0;
}

.date-picker-item { // LINE 117
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.picker-label { // LINE 122
  font-size: 14px;
  color: @text-color-secondary; // USES A VARIABLE
  margin-right: @spacing-sm; // USES A VARIABLE
  white-space: nowrap;
}

.custom-picker-input { // LINE 129
  width: 260px;
  height: 36px;
  border-radius: @border-radius-sm; // USES A VARIABLE
  border: 1px solid #E3E3E3;
  font-size: 13px;

  &:hover { // LINE 136
    border-color: @primary-color; // USES A VARIABLE
  }
  &.ant-picker-focused, // LINE 139
  &:focus-within { // LINE 140
    border-color: @primary-color; // USES A VARIABLE
    box-shadow: 0 0 0 2px fade(@primary-color, 20%); // USES A VARIABLE and LESS function
  }

  :deep(.ant-picker-input > input) { // LINE 145
    font-size: 13px;
    &::placeholder { // LINE 147
        color: #BFBFBF;
    }
  }
  :deep(.ant-picker-range-separator .ant-picker-separator) {
    color: #BFBFBF;
  }
  .picker-icon-style.anticon-calendar { // LINE 154 - THIS IS LIKELY THE CULPRIT
    color: #BFBFBF;
    font-size: 14px;
  }
}
:deep(.ant-picker-range .ant-picker-active-bar){
  background: @primary-color; 
}
</style>

