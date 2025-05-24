<template>
  <a-form ref="formRef" :model="internalFormModel" :label-col="labelCol" :wrapper-col="wrapperCol" class="dynamic-form"
    :layout="formLayout" @finish="onFinish" @finishFailed="onFinishFailed">
    <a-row :gutter="[16, 0]">
      <template v-for="field in formConfig" :key="field.field">
        <a-col :span="field.span || defaultSpan">
          <a-form-item :label="field.label" :name="field.field" :rules="isEditMode ? field.rules : []"
            :extra="!isEditMode && field.displayExtra ? field.displayExtra(internalFormModel[field.field], internalFormModel) : null"
            class="form-item-custom">
            <!-- Display Mode -->
            <template v-if="!isEditMode">
              <span v-if="field.fieldType === 'select' && field.options" class="form-text-display">
                {{ getSelectDisplayValue(field, internalFormModel[field.field]) }}
              </span>
              <span v-else-if="field.fieldType === 'dateRange' && Array.isArray(internalFormModel[field.field])"
                class="form-text-display">
                {{ internalFormModel[field.field][0] }} - {{ internalFormModel[field.field][1] }}
              </span>
              <span v-else-if="field.fieldType === 'amount'" class="form-text-display">
                {{ formatAmount(internalFormModel[field.field]) }}
              </span>
              <span v-else-if="field.displayFormatter" class="form-text-display">
                {{ field.displayFormatter(internalFormModel[field.field], internalFormModel) }}
              </span>
              <span v-else class="form-text-display">
                {{ internalFormModel[field.field] || '-' }}
              </span>
            </template>

            <!-- Edit Mode -->
            <template v-else>
              <a-input v-if="field.fieldType === 'input'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" allow-clear />
              <a-select v-else-if="field.fieldType === 'select'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请选择${field.label}`"
                :options="field.options || selectOptions(field.dictKey)" :mode="field.selectMode"
                :filter-option="field.remoteSearch ? false : filterOption"
                :show-search="field.remoteSearch || field.showSearch" :loading="field.loading"
                @search="field.remoteSearch ? (value) => field.onRemoteSearch(value) : null" :disabled="field.disabled"
                allow-clear />
              <a-radio-group v-else-if="field.fieldType === 'radio'" v-model:value="internalFormModel[field.field]"
                :options="field.options" :disabled="field.disabled" />
              <a-date-picker v-else-if="field.fieldType === 'date'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请选择${field.label}`" value-format="YYYY-MM-DD" style="width: 100%;"
                :disabled="field.disabled" />
              <a-range-picker v-else-if="field.fieldType === 'dateRange'" v-model:value="internalFormModel[field.field]"
                value-format="YYYY-MM-DD" style="width: 100%;" :disabled="field.disabled" />
              <a-textarea v-else-if="field.fieldType === 'textarea'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :rows="field.rows || 3"
                :disabled="field.disabled" allow-clear />
              <a-input-number v-else-if="field.fieldType === 'amount'" v-model:value="internalFormModel[field.field]"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')" :precision="field.precision || 2"
                style="width: 100%;" :placeholder="field.placeholder || `请输入${field.label}`"
                :disabled="field.disabled" />
              <!-- Add more field types as needed -->
            </template>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
import { ref, watch, reactive, onMounted } from 'vue';
import {
  Form as AForm, FormItem as AFormItem, Input as AInput,
  Select as ASelect, RadioGroup as ARadioGroup, DatePicker as ADatePicker,
  Textarea as ATextarea, InputNumber as AInputNumber, Row as ARow, Col as ACol,
  RangePicker as ARangePicker,
} from 'ant-design-vue';
const auth = useAuthStore();
const selectOptions = (dictKey) => {
  if (!dictKey) return [];
  if (!auth.sysAllDictItems[dictKey]) return []
  return auth.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
};

const props = defineProps({
  formConfig: { type: Array, required: true },
  initialModel: { type: Object, default: () => ({}) },
  isEditMode: { type: Boolean, default: false },
  formLayout: { type: String, default: 'vertical' }, // 'horizontal', 'vertical', 'inline'
  labelCol: { type: Object, default: () => ({ span: 24 }) }, // Full width for vertical
  wrapperCol: { type: Object, default: () => ({ span: 24 }) }, // Full width for vertical
  defaultSpan: { type: Number, default: 12 } // Default to 2 columns if span not specified
});

const emit = defineEmits(['submit', 'validationFailed']);

const formRef = ref(null);
const internalFormModel = reactive({});

// Initialize or update internalFormModel when initialModel changes
watch(() => props.initialModel, (newModel) => {
  // Clear existing keys to avoid reactivity issues with deleted keys
  Object.keys(internalFormModel).forEach(key => delete internalFormModel[key]);
  // Assign new model properties
  Object.assign(internalFormModel, newModel || {});
}, { deep: true, immediate: true });


const getSelectDisplayValue = (fieldConfig, value) => {
  if (!fieldConfig.options) return value || '-';
  if (fieldConfig.selectMode === 'multiple' || fieldConfig.selectMode === 'tags') {
    if (!Array.isArray(value) || value.length === 0) return '-';
    return value.map(val => {
      const option = fieldConfig.options.find(opt => opt.value === val);
      return option ? option.label : val;
    }).join(', ');
  } else {
    const option = fieldConfig.options.find(opt => opt.value === value);
    return option ? option.label : (value || '-');
  }
};

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (isNaN(num)) return value; // Return original if not a number
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const onFinish = (values) => {
  console.log('Form Submitted:', values);
  emit('submit', { ...internalFormModel }); // Emit a copy
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
  emit('validationFailed', errorInfo);
};

const validate = () => formRef.value?.validate();
const resetFields = () => {
  formRef.value?.resetFields();
  // Also reset internalFormModel to initial or empty if needed,
  // as AntD resetFields only resets to initial values of the form item itself.
  Object.assign(internalFormModel, props.initialModel || {});
};
const clearValidate = () => formRef.value?.clearValidate();


defineExpose({ validate, resetFields, clearValidate, formModel: internalFormModel });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.dynamic-form {
  // General form styling
}

.form-item-custom {
  width: 400px;

  // Styling for antd form item to match the design
  :deep(.ant-form-item-label > label) {
    color: @text-color-secondary; // Label color from design
    font-size: 14px;
  }

  // For vertical layout specifically, make labels less prominent
  &.ant-form-item-label-top :deep(.ant-form-item-label > label) {
    // height: auto;
    // line-height: 1.5;
    padding-bottom: 4px; // Reduce space below label in vertical mode
  }


  .form-text-display {
    font-size: 14px;
    color: @text-color-base;
    line-height: 32px; // Match input height for alignment
    display: inline-block; // Or block if it needs to take full width
    padding: 0 @spacing-sm; // Mimic input padding for display text
    min-height: 32px; // Ensure it has some height even if empty
    word-break: break-all; // Break long text
  }

  // Inputs in edit mode
  :deep(.ant-select),
  :deep(.ant-input),
  :deep(.ant-input-number),
  :deep(.ant-picker),
  :deep(.ant-input-textarea-show-count > .ant-input) {
    border-radius: @border-radius-sm; // More subtle rounding
    // border-color: @border-color-base; // Lighter border
    // &:hover {
    //   border-color: @primary-color;
    // }
    // &:focus, &.ant-input-focused, &.ant-select-focused .ant-select-selector {
    //   border-color: @primary-color;
    //   box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    // }
  }

  :deep(.ant-input),
  :deep(.ant-input-number-input) {
    height: 36px; // Standard height
  }

  :deep(.ant-select-selector) {
    height: 36px !important;
    padding-top: 2px !important; // Adjust select text vertical alignment
    padding-bottom: 2px !important;
  }

  :deep(.ant-picker) {
    height: 36px;
  }

  :deep(.ant-input-textarea .ant-input) {
    min-height: 80px; // Example for textarea
  }
}
</style>