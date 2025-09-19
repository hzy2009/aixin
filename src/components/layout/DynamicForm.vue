<template>
  <a-form ref="formRef" :model="internalFormModel" :label-col="labelCol" :wrapper-col="wrapperCol" class="dynamic-form"
    :layout="formLayout" @finish="onFinish" @finishFailed="onFinishFailed">
    <a-row :gutter="[16, 0]">
      <template v-for="field in formConfig" :key="field.field">
        <a-col :span="field.span || defaultSpan" v-if="!field.hidden">
          <a-form-item :label="field.label" :name="field.field" :rules="allRules(field)" class="form-item-custom"
            :class="{ 'form-item-full-width-input': field.fieldType === 'textarea' || field.fullWidthInput, 'phoneOrEmail': field.fieldType === 'phone' || field.fieldType === 'email' }">
            <div class="field-with-tips">

              <!-- 1. Special Case: Image Upload Field -->
              <ImageUploadField
                v-if="field.fieldType === 'imageUpload' || field.fieldType === 'imageWall'"
                v-model:value="internalFormModel[field.field]"
                :max-count="field.maxCount || 1"
                :disabled="isFieldDisabled(field)"
                :upload-hint="field.uploadHint"
              />

              <!-- 2. Special Case: Erjisb Field -->
              <ErjiField
                v-else-if="field.fieldType === 'erjisb'"
                v-model="internalFormModel"
                :disabled="isFieldDisabled(field)"
              />

              <!-- 3. Special Case: Slot -->
              <span v-else-if="field.fieldType === 'slot'">
                <slot :name="field.field" :dataSource="internalFormModel"></slot>
              </span>

              <!-- 4. General Case: Dynamic Component -->
              <component v-else-if="componentMap[field.fieldType]"
                :is="componentMap[field.fieldType]"
                v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || (field.fieldType === 'select' ? `请选择${field.label}` : `请输入${field.label}`)"
                :disabled="isFieldDisabled(field)"
                v-bind="getComponentProps(field)"
                @change="(...args) => handleEvent('change', field, ...args)"
                @blur="(...args) => handleEvent('blur', field, ...args)"
                @focus="(...args) => handleEvent('focus', field, ...args)"
                @search="(...args) => handleEvent('search', field, ...args)"
              />

              <!-- Tips shown below all field types -->
              <div v-if="field.tips" class="field-tips">{{ field.tips }}</div>
            </div>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<script setup>
import { ref, watch, reactive, shallowRef } from 'vue';
import { 
  Form as AForm, FormItem as AFormItem, Input as AInput, InputPassword as AInputPassword,
  Select as ASelect, RadioGroup as ARadioGroup, DatePicker as ADatePicker,
  Textarea as ATextarea, InputNumber as AInputNumber, Row as ARow, Col as ACol,
  RangePicker as ARangePicker 
} from 'ant-design-vue';
import { selectOptions } from '@/utils/index';
import dayjs from 'dayjs';

// Import new child components
import ImageUploadField from '@/components/common/ImageUploadField.vue';
import ErjiField from '@/components/common/ErjiField.vue';

// --- Component Map for Dynamic Rendering ---
const componentMap = shallowRef({
  'input': AInput,
  'password': AInputPassword,
  'number': AInputNumber,
  'select': ASelect,
  'radio': ARadioGroup,
  'date': ADatePicker,
  'dateRange': ARangePicker,
  'textarea': ATextarea,
  'amount': AInputNumber,
  'email': AInput,
  'phone': AInput,
});

const getComponentProps = (field) => {
  const baseProps = {
    style: { width: '100%' },
    allowClear: true,
  };

  const fieldTypeProps = {
    select: {
      options: field.options || selectOptions(field.dictKey),
      mode: field.selectMode,
      filterOption: field.remoteSearch ? false : filterOption,
      loading: field.loading,
    },
    radio: {
      options: field.options,
    },
    date: {
      'disabled-date': field.disabledDate || ((e) => disabledDate(e, field)),
      valueFormat: field.valueFormat || 'YYYY-MM-DD HH:mm:ss',
      showTime: field.showTime,
    },
    dateRange: {
      valueFormat: field.valueFormat || 'YYYY-MM-DD',
      showTime: field.showTime,
    },
    textarea: {
      rows: field.rows || 4,
      maxlength: field.maxLength,
      showCount: true,
    },
    amount: {
      formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: value => value.replace(/\$\s?|(,*)/g, ''),
      precision: field.precision !== undefined ? field.precision : 2,
      min: field.min !== undefined ? field.min : 0,
    },
    number: {
        min: field.min,
        max: field.max
    }
  };

  return { ...baseProps, ...(fieldTypeProps[field.fieldType] || {}), ...field.componentProps };
};

const props = defineProps({
  formConfig: { type: Array, required: true },
  initialModel: { type: Object, default: () => ({}) },
  formLayout: { type: String, default: 'horizontal' },
  labelCol: { type: Object, default: () => ({ span: 3 }) },
  wrapperCol: { type: Object, default: () => ({ span: 8 }) },
  defaultSpan: { type: Number, default: 12 }
});

const emit = defineEmits(['submit', 'validationFailed', 'fieldChange', 'fieldEvent']);

const formRef = ref(null);
const internalFormModel = reactive({});

const handleEvent = (eventName, field, ...args) => {
  const value = args[0];
  emit('fieldEvent', { eventName, field: field.field, args, formModel: internalFormModel });

  if (field.events && typeof field.events[eventName] === 'function') {
    field.events[eventName](internalFormModel, ...args);
  }

  if (eventName === 'change') {
    const option = field.fieldType === 'select' ? args[1] : undefined;
    emit('fieldChange', { field: field.field, value, formModel: internalFormModel, option });

    if (typeof field.onChange === 'function') {
      field.onChange({ value, field, form: internalFormModel, formModel: internalFormModel, option });
    }

    if (field.fieldType === 'date' && field.field === 'createTime') {
      internalFormModel['expireDate'] = '';
    }
  }
};

const isFieldDisabled = (field) => {
  if (typeof field.disabled === 'function') {
    return field.disabled({ formModel: internalFormModel });
  }
  return !!field.disabled;
};

watch(() => props.initialModel, (newModel) => {
  const modelToAssign = JSON.parse(JSON.stringify(newModel || {}));
  
  // Initialize fields that need it (e.g., image fields expecting an array)
  props.formConfig.forEach(field => {
      if ((field.fieldType === 'imageUpload' || field.fieldType === 'imageWall') && !modelToAssign[field.field]) {
          modelToAssign[field.field] = [];
      }
  });

  // Clear old model keys before assigning new ones
  Object.keys(internalFormModel).forEach(key => delete internalFormModel[key]);
  Object.assign(internalFormModel, modelToAssign);

}, { deep: true, immediate: true });

const filterOption = (input, option) => {
  return option.label && option.label.toLowerCase().includes(input.toLowerCase());
};

const onFinish = (values) => {
  const formDataToSubmit = getAllData();
  emit('submit', formDataToSubmit);
};

const onFinishFailed = (errorInfo) => {
  emit('validationFailed', errorInfo);
};

const validate = () => formRef.value?.validate();
const resetFields = () => {
  formRef.value?.resetFields();
  const modelToAssign = JSON.parse(JSON.stringify(props.initialModel || {}));
  props.formConfig.forEach(field => {
    if ((field.fieldType === 'imageUpload' || field.fieldType === 'imageWall') && !modelToAssign[field.field]) {
        modelToAssign[field.field] = [];
    }
  });
  Object.keys(internalFormModel).forEach(key => delete internalFormModel[key]);
  Object.assign(internalFormModel, modelToAssign);
};
const clearValidate = () => formRef.value?.clearValidate();

const getAllData = () => {
  const params = JSON.parse(JSON.stringify(internalFormModel || {}));
  props.formConfig.forEach(field => {
    if ((field.fieldType === 'imageUpload' || field.fieldType === 'imageWall') && Array.isArray(params[field.field])) {
      const urls = params[field.field]
        .filter(file => file.status === 'done' && (file.response || file.url))
        .map(file => file.response?.message || (file.url ? file.url.replace(import.meta.env.VITE_GLOB_API_URL + '/', '') : null))
        .filter(Boolean);

      if (field.fieldType === 'imageUpload') {
        params[field.field] = urls.length > 0 ? urls[0] : null;
      } else { // imageWall
        params[field.field] = urls.join(',');
      }
    }
  });
  return params;
};

const disabledDate = (current, field) => {
  if (field.field === 'expireDate' && current) {
    return current < dayjs(internalFormModel['createTime']).subtract(0, 'day');
  }
  return current && current < dayjs().subtract(1, 'day');
};

const validateEmail = async (_rule, value) => {
  if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return Promise.reject('请输入有效的邮箱地址！');
  } else if (!value) {
    return Promise.reject('请输入邮箱地址！');
  }
  return Promise.resolve();
};

const rulePresets = {
  email: [{ validator: validateEmail, trigger: 'change', required: true }],
  phone: [{ trigger: 'change', required: true }],
};

const allRules = (field) => {
  const baseRules = field.rules || []; // Default to empty, let required handle it
  // Automatically add required rule if not present in custom rules
  if (field.required && !baseRules.some(r => r.required)) {
      baseRules.unshift({ required: true, message: `${field.label}是必填项`, trigger: 'change' });
  }
  const presetRules = rulePresets[field.fieldType] || [];
  return [...baseRules, ...presetRules];
};

defineExpose({ validate, resetFields, clearValidate, getAllData, formModel: internalFormModel, formRef });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.dynamic-form {
  // General form styling
}

.form-item-custom {

  :deep(.ant-form-item-label > label) {
    color: @text-color-base;
    font-size: 14px;
    font-weight: 400;
  }

  &.ant-form-horizontal :deep(.ant-form-item-label) {
    text-align: right;
  }

  :deep(.ant-select),
  :deep(.ant-input),
  :deep(.ant-input-number),
  :deep(.ant-picker),
  :deep(.ant-input-textarea-show-count > .ant-input) {
    border-radius: 6px;
    border-color: #D9D9D9;

    &:hover {
      border-color: @primary-color;
    }

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector,
    &.ant-picker-focused {
      border-color: @primary-color;
      box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    }
  }

  :deep(.ant-input-number),
  :deep(.ant-select-selector),
  :deep(.ant-picker) {
    height: 36px !important;
  }

  :deep(.ant-input) {
    height: 26px !important;
  }

  :deep(.ant-input-number-input) {
    height: 34px !important;
    line-height: 34px;
  }

  :deep(.ant-select-selection-item),
  :deep(.ant-select-selection-placeholder) {
    line-height: 34px !important;
  }

  :deep(.ant-picker-input > input) {
    line-height: 1.5715;
  }

  :deep(.ant-input-textarea .ant-input) {
    min-height: 120px;
  }
}

.phoneOrEmail{
    margin-bottom:  16px; 
}

.field-with-tips {
  position: relative;
  
  .field-tips {
    color: #656C74;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
    line-height: 1.4;
  }
}
</style>