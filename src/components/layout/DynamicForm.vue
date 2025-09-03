<template>
  <a-form ref="formRef" :model="internalFormModel" :label-col="labelCol" :wrapper-col="wrapperCol" class="dynamic-form"
    :layout="formLayout" @finish="onFinish" @finishFailed="onFinishFailed">
    <a-row :gutter="[16, 0]">
      <template v-for="field in formConfig" :key="field.field">
        <a-col :span="field.span || defaultSpan" v-if="!field.hidden">
          <!-- 关键修改点：将 allRules(field.rules) 修改为 allRules(field)，以便函数能获取到 fieldType -->
          <a-form-item :label="field.label" :name="field.field" :rules="allRules(field)" class="form-item-custom"
            :class="{ 'form-item-full-width-input': field.fieldType === 'textarea' || field.fullWidthInput, 'phoneOrEmail': field.fieldType === 'phone' || field.fieldType === 'email' }">
            <div class="field-with-tips">
              <a-input v-if="field.fieldType === 'input'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" allow-clear />
              <a-input-password v-else-if="field.fieldType === 'password'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" allow-clear />

              <a-input-number v-else-if="field.fieldType === 'number'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" style="width: 100%;"
                :min="field.min" :max="field.max" />

              <a-select v-else-if="field.fieldType === 'select'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请选择${field.label}`"
                :options="field.options || selectOptions(field.dictKey)" :mode="field.selectMode"
                :filter-option="field.remoteSearch ? false : filterOption" :loading="field.loading"
                :disabled="field.disabled" @change="(v, option) => handleSelectChange(v, field, option)" allow-clear />

              <a-radio-group v-else-if="field.fieldType === 'radio'" v-model:value="internalFormModel[field.field]"
                :options="field.options" :disabled="field.disabled" />

              <a-date-picker v-else-if="field.fieldType === 'date'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请选择${field.label}`"
                :disabled-date="field.disabledDate || function(e) {return disabledDate(e, field)}"
                :value-format="field.valueFormat || 'YYYY-MM-DD HH:mm:ss'" :show-time="field.showTime"
                @change="(v) => handleDateChange(v, field)"
                style="width: 100%;" :disabled="field.disabled" />

              <a-range-picker v-else-if="field.fieldType === 'dateRange'" v-model:value="internalFormModel[field.field]"
                :value-format="field.valueFormat || 'YYYY-MM-DD'" :show-time="field.showTime" style="width: 100%;"
                :disabled="field.disabled" />

              <a-textarea v-else-if="field.fieldType === 'textarea'" v-model:value="internalFormModel[field.field]"
                :placeholder="field.placeholder || `请输入${field.label}`" :rows="field.rows || 4" :disabled="field.disabled"
                allow-clear :maxlength="field.maxLength" show-count />

              <a-input-number v-else-if="field.fieldType === 'amount'" v-model:value="internalFormModel[field.field]"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                :precision="field.precision !== undefined ? field.precision : 2" style="width: 100%;"
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled"
                :min="field.min !== undefined ? field.min : 0" />
              <!-- New Image Upload Field -->
              <div v-else-if="field.fieldType === 'imageUpload'" class="image-upload-container">
                <a-upload v-model:file-list="internalFormModel[field.field]" :name="field.uploadName || 'file'"
                  list-type="picture-card" class="custom-image-uploader"
                  :show-upload-list="field.showUploadList !== undefined ? field.showUploadList : true" :action="uploadUrl"
                  :before-upload="field.beforeUpload || beforeUpload" accept="image/*" :headers="getHeaders()"
                  :data="{ biz: 'temp' }" @change="(info) => handleImageUploadChange(info, field)"
                  @preview="handleImagePreview" :max-count="field.maxCount || 1" :disabled="field.disabled">
                  <div
                    v-if="(!internalFormModel[field.field] || internalFormModel[field.field].length < (field.maxCount || 1))">
                    <PlusOutlined />
                    <div style="margin-top: 8px">上传</div>
                  </div>
                </a-upload>
                <div v-if="field.uploadHint" class="upload-hint">{{ field.uploadHint }}</div>
              </div>
              <div v-else-if="field.fieldType === 'erjisb'">
                <a-select v-model:value="internalFormModel['productMainTypeCode']" :placeholder="`请选择`"
                  style="width: 48%; margin-right: 4%" :options="selectOptions('product_main_type')"
                  :disabled="field.disabled" @change="(v, option) => handleSelectProductMainTypeChange(v, field, option)"
                  allow-clear />

                <a-select v-model:value="internalFormModel['productType']" :placeholder="`请选择`"
                  :disabled="!internalFormModel['productMainTypeCode']" style="width: 48%;"
                  :options="internalFormModel['productMainTypeCode'] == 'product_type' ? selectOptions('product_type') : selectOptions('product_type_material')"
                  @change="(v, option) => handleSelectProductTypeChange(v, field, option)" allow-clear />
              </div>
              <a-input v-else-if="field.fieldType === 'email'" v-model:value="internalFormModel[field.field]" 
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" allow-clear />
              <a-input v-else-if="field.fieldType === 'phone'" v-model:value="internalFormModel[field.field]" 
                :placeholder="field.placeholder || `请输入${field.label}`" :disabled="field.disabled" allow-clear />
              <span v-else-if="field.fieldType === 'slot'">
                <slot :name="field.field" :dataSource="internalFormModel"></slot>
              </span>
              <!-- Add more field types as needed -->
              
              <!-- Tips 显示在所有字段类型下方 -->
              <div v-if="field.tips" class="field-tips">{{ field.tips }}</div>
            </div>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>

  <!-- Image Preview Modal -->
  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" v-draggable @cancel="handlePreviewCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore'; // Assuming this is for selectOptions
import { ref, watch, reactive } from 'vue';
import {
  Form as AForm, FormItem as AFormItem, Input as AInput,
  Select as ASelect, RadioGroup as ARadioGroup, DatePicker as ADatePicker,
  Textarea as ATextarea, InputNumber as AInputNumber, Row as ARow, Col as ACol,
  RangePicker as ARangePicker, Upload as AUpload, Modal as AModal, message

} from 'ant-design-vue';
import { selectOptions } from '@/utils/index';
import { PlusOutlined } from '@ant-design/icons-vue';
import { getFileAccessHttpUrl, getRandom } from "@/utils/index";
import dayjs from 'dayjs';
const uploadUrl = `${import.meta.env.VITE_GLOB_UPLOAD_URL}/sys/common/upload` || '/api';
const auth = useAuthStore(); // For dictionary options


const props = defineProps({
  formConfig: { type: Array, required: true },
  initialModel: { type: Object, default: () => ({}) },
  formLayout: { type: String, default: 'horizontal' }, // Changed default to horizontal to match image
  labelCol: { type: Object, default: () => ({ span: 3 }) }, // Default for horizontal
  wrapperCol: { type: Object, default: () => ({ span: 8 }) },// Default for horizontal
  defaultSpan: { type: Number, default: 12 } // Default to full width for each item in horizontal
});

const emit = defineEmits(['submit', 'validationFailed', 'fieldChange']);

const formRef = ref(null);
const internalFormModel = reactive({});

const getFileName = (path) => {
  if (path.lastIndexOf('\\') >= 0) {
    let reg = new RegExp('\\\\', 'g');
    path = path.replace(reg, '/');
  }
  return path.substring(path.lastIndexOf('/') + 1);
};
watch(() => props.initialModel, (newModel) => {
  Object.keys(internalFormModel).forEach(key => delete internalFormModel[key]);
  const modelToAssign = JSON.parse(JSON.stringify(newModel || {}));

  // Ensure fileList for imageUpload is initialized correctly
  props.formConfig.forEach(field => {
    if (field.fieldType === 'imageUpload') {
      if (!modelToAssign[field.field]) {
        modelToAssign[field.field] = []; // Initialize as empty array for AntD Upload
      } else {
        modelToAssign[field.field] = [{
          uid: getRandom(10),
          name: "图片",
          status: 'done',
          url: getFileAccessHttpUrl(modelToAssign[field.field]),
          response: {
            status: 'history',
            message: modelToAssign[field.field],
          },
        }]
      }
    }
  });
  Object.assign(internalFormModel, modelToAssign);
}, { deep: true, immediate: true });


const filterOption = (input, option) => {
  return option.label && option.label.toLowerCase().includes(input.toLowerCase());
};

const onFinish = (values) => {
  console.log('Form Submitted:', values);
  // Prepare formData for submission, especially for file uploads
  const formDataToSubmit = { ...internalFormModel };
  props.formConfig.forEach(field => {
    if (field.fieldType === 'imageUpload' && Array.isArray(formDataToSubmit[field.field])) {
      // AntD Upload fileList contains rich objects.
      // You might need to extract just the server URL or ID for submission.
      // Or if your API expects file objects, you might handle it differently (e.g., FormData)
      formDataToSubmit[field.field] = formDataToSubmit[field.field]
        .filter(file => file.status === 'done' && file.response) // Only successfully uploaded files
        .map(file => file.response?.url || file.url || file.thumbUrl); // Extract URL or ID from response
      if ((field.maxCount || 1) === 1 && formDataToSubmit[field.field].length > 0) {
        formDataToSubmit[field.field] = formDataToSubmit[field.field][0]; // Single image, send string URL
      } else if ((field.maxCount || 1) === 1 && formDataToSubmit[field.field].length === 0) {
        formDataToSubmit[field.field] = null; // Or empty string, depending on backend
      }
    }
  });
  emit('submit', formDataToSubmit);
};

const onFinishFailed = (errorInfo) => {
  console.log('Form Submission Failed:', errorInfo);
  emit('validationFailed', errorInfo);
};

const handleSelectChange = (value, fieldConfig, option) => {
  // Emit a generic fieldChange event
  emit('fieldChange', { field: fieldConfig.field, value, option, formModel: internalFormModel });
  if (fieldConfig.onChange) {
    fieldConfig.onChange({ value, field: fieldConfig, form: internalFormModel, option });
  }
};
const handleDateChange = (value, fieldConfig) => {
  emit('fieldChange', { field: fieldConfig.field, value, formModel: internalFormModel });
  if (fieldConfig.field == 'createTime') {
    internalFormModel['expireDate'] = '';
  }
  if (fieldConfig.onChange) {
    fieldConfig.onChange({ value, field: fieldConfig, form: internalFormModel });
  }
}

// --- Image Upload Specific Logic ---
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const handleImagePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handlePreviewCancel = () => {
  previewVisible.value = false;
};

const handleImageUploadChange = (info, fieldConfig) => {
  // internalFormModel[fieldConfig.field] is already bound with v-model:file-list
  // This handler is for additional logic like showing messages or custom status updates
  if (info.file.status === 'uploading') {
    // fieldConfig.loading = true; // If you have a loading state per field
    return;
  }
  if (info.file.status === 'done') {
    if (info.file.response.success === false) {
      message.error(info.file.response.message);
      const failIndex = internalFormModel[fieldConfig.field].findIndex((item) => item.uid === info.file.uid); // Corrected 'file' to 'info.file'
      if (failIndex != -1) {
        internalFormModel[fieldConfig.field].splice(failIndex, 1);
      }
    } else { // Only show success if response is not an error
      message.success(`${info.file.name} 上传成功`);
    }
  } else if (info.file.status === 'error') {
    // fieldConfig.loading = false;
    message.error(`${info.file.name} 上传失败.`);
  }
};
// --- End Image Upload Logic ---


const validate = () => formRef.value?.validate();
const resetFields = () => {
  formRef.value?.resetFields();
  // Re-initialize based on props.initialModel to ensure deep reactivity and correct fileList reset
  const modelToAssign = JSON.parse(JSON.stringify(props.initialModel || {}));
  props.formConfig.forEach(field => {
    if (field.fieldType === 'imageUpload') {
      if (!modelToAssign[field.field] || !Array.isArray(modelToAssign[field.field])) {
        modelToAssign[field.field] = [];
      }
    }
  });
  Object.keys(internalFormModel).forEach(key => delete internalFormModel[key]);
  Object.assign(internalFormModel, modelToAssign);
};
const clearValidate = () => formRef.value?.clearValidate();
const getAllData = () => {
  const paranms = JSON.parse(JSON.stringify(internalFormModel || {}));
  props.formConfig.forEach(fielditem => {
    if (fielditem.fieldType === 'imageUpload') {
      if (paranms[fielditem.field] && paranms[fielditem.field][0] && paranms[fielditem.field][0].response.message) {
        paranms[fielditem.field] = paranms[fielditem.field][0].response.message
      } else {
        paranms[fielditem.field] = null
      }
    }
  });
  return paranms
}

const beforeUpload = (file) => {
  let fileType = file.type;
  if (fileType.indexOf('image') < 0) {
    message.info('请上传图片'); // Corrected to use AntD's message
    return false;
  }
  return true; // Return true to allow upload
};

const getHeaders = () => {
  return reactive({
    'X-Access-Token': auth.token,
    'X-Tenant-Id': auth.userInfo.id || '0',
  });
}
const disabledDate = (current, field) => {
  if (field.field == 'expireDate' && current) {
    return current < dayjs(internalFormModel['createTime']).subtract(0, 'day');
  }
  // 不能选择上个月的日期
  return current && current < dayjs().subtract(1, 'day');
}
//特殊代码不复用的烂代码，赶时间
const handleSelectProductMainTypeChange = (v, field, option) => {
  internalFormModel['productMainTypeName'] = option?.label
  internalFormModel['productType'] = ''
  internalFormModel['productTypeName'] = ''
}
const handleSelectProductTypeChange = (v, field, option) => {
  internalFormModel['productTypeName'] = option?.label
}

// --- 核心修改：校验逻辑 ---

/**
 * 校验邮箱地址格式
 */
const validateEmail = async (_rule, value) => {
  if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return Promise.reject('请输入有效的邮箱地址！');
  } else if (!value) {
    return Promise.reject('请输入邮箱地址！');
  }
  return Promise.resolve();
};

/**
 * 校验手机号码格式（内地11位）
 */
// const validatePhone = async (_rule, value) => {
//   if (value && !/^1[3-9]\d{9}$/.test(value)) {
//     return Promise.reject('请输入有效的11位手机号码！');
//   }
//   return Promise.resolve();
// };

// 创建一个包含特殊校验规则的预设对象
const rulePresets = {
  email: [{ validator: validateEmail, trigger: 'change', required: true}],
  phone: [{  trigger: 'change', required: true }],
  // 未来可以扩展更多，如身份证号等
};

/**
 * 动态生成最终的校验规则数组
 * @param {object} field - 当前字段的完整配置对象
 * @returns {Array} - 返回给 a-form-item 使用的规则数组
 */
const allRules = (field) => {
  // 1. 获取从外部 formConfig 传入的基础规则 (如 required, min, max 等)
  const baseRules = field.rules || [{  trigger: 'change', required: true }];

  // 2. 根据 field.fieldType 从预设中查找额外的格式校验规则
  const presetRules = rulePresets[field.fieldType] || [];

  // 3. 合并两种规则，返回一个扁平化的数组
  return [...baseRules, ...presetRules];
};

// --- 校验逻辑修改结束 ---

defineExpose({ validate, resetFields, clearValidate, getAllData, formModel: internalFormModel, formRef });
</script>

<style scoped lang="less">
// ... 您的样式代码保持不变，此处省略 ...
@import '@/assets/styles/_variables.less';

.dynamic-form {
  // General form styling
}

.form-item-custom {
  // Default width for input elements to match the image (approx)
  // This will be overridden if span is used to make it wider or narrower in a row.
  // For horizontal layout, wrapperCol controls width primarily.
  // This might be better handled by wrapperCol in horizontal layout.

  :deep(.ant-form-item-label > label) {
    color: @text-color-base; // Label text color is darker in the image
    font-size: 14px;
    font-weight: 400; // Not bold
    // text-align: right; // Ensure labels are right-aligned for horizontal form
  }

  // AntD horizontal form specific label alignment
  &.ant-form-horizontal :deep(.ant-form-item-label) {
    text-align: right;
    // You might need to adjust width based on props.labelCol if it's a fixed number of columns
    // Default AntD behavior should handle this with labelCol prop.
  }


  // Inputs, Selects, etc.
  :deep(.ant-select),
  :deep(.ant-input),
  :deep(.ant-input-number),
  :deep(.ant-picker),
  :deep(.ant-input-textarea-show-count > .ant-input) {
    // Target the inner input for textarea with show-count
    border-radius: 6px; // Subtle rounding
    border-color: #D9D9D9; // Standard AntD border color

    &:hover {
      border-color: @primary-color;
    }

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector,
    &.ant-picker-focused {
      // Add focused state for datepicker
      border-color: @primary-color;
      box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    }
  }

  // Consistent height for input-like elements
  // :deep(.ant-input),
  :deep(.ant-input-number),
  // Wrapper for input number
  :deep(.ant-select-selector),
  :deep(.ant-picker) {
    height: 36px !important; // Ensure consistent height
  }

  :deep(.ant-input) {
    height: 26px !important;
  }

  :deep(.ant-input-number-input) {
    // Actual input within input-number
    height: 34px !important; // Adjust to fit within wrapper
    line-height: 34px;
  }

  :deep(.ant-select-selection-item),
  :deep(.ant-select-selection-placeholder) {
    line-height: 34px !important; // Vertically center text in select
  }

  :deep(.ant-picker-input > input) {
    line-height: 1.5715; // Default AntD, may need adjustment if text not centered
  }


  // Specific for Textarea to match image height
  :deep(.ant-input-textarea .ant-input) {
    min-height: 120px; // Adjust based on image, looks like 3-4 lines input field + padding
  }

  // Specific for image upload to match design
  .image-upload-container {
    .custom-image-uploader {
      :deep(.ant-upload.ant-upload-select-picture-card) {
        width: 120px; // Width of the upload box
        height: 120px; // Height of the upload box
        margin: 0; // Remove default margins if any
        background-color: #FAFAFA; // Light gray background for uploader
        border: 1px dashed #D9D9D9; // Dashed border
        border-radius: @border-radius-sm;

        &:hover {
          border-color: @primary-color;
        }
      }

      // Style for already uploaded image thumbnail in list
      :deep(.ant-upload-list-picture-card-container) {
        width: 120px;
        height: 120px;
        margin: 0;
      }

      :deep(.ant-upload-list-item-actions .anticon) {
        font-size: 16px; // Make preview/delete icons a bit larger
      }
    }

    .upload-hint {
      font-size: 14px;
      color: @text-color-tertiary;
      margin-top: @spacing-xs;
      line-height: 1.5;
    }
  }

  // If a field needs to take more width like textarea in horizontal form
  &.form-item-full-width-input {
    // This class might be used if labelCol/wrapperCol defaults are not enough
    // For example, if label is short but input needs to be very wide
    // :deep(.ant-form-item-control-input-content) {
    //   max-width: 600px; // Example max width
    // }
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
    letter-spacing: 0%;
    text-align: right;
    margin-top: 4px;
    line-height: 1.4;
  }
}
</style>