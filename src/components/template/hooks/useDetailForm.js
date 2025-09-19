import { computed, markRaw, watch } from 'vue';
import { selectOptions, getFileAccessHttpUrl, formatDate, maskMiddle, getRandom } from '@/utils/index';
import defaultImg from '@/assets/images/default.jpg';
import dayjs from 'dayjs';
import { message, Input, Select, DatePicker, Textarea, Upload } from 'ant-design-vue';

// 将组件标记为非响应式, 提升性能
const formComponentMap = markRaw({
  input: Input,
  select: Select,
  date: DatePicker,
  textarea: Textarea,
  imageUpload: Upload,
});

// --- 内部辅助函数 ---
const getSelectDisplayValue = (config, value) => {
  const options = config.options || selectOptions(config.dictKey);
  if (!options) return value || '-';
  if (Array.isArray(value)) {
    return value.map(v => options.find(opt => opt.value === v)?.label || v).join(', ') || '-';
  }
  return options.find(opt => opt.value === value)?.label || value || '-';
};

const getDataDisplayValue = (dt) => dt ? formatDate(dt) : '-';
const getImgUrl = (url, fn, model) => url ? getFileAccessHttpUrl(url) : (fn ? fn(model) : defaultImg);

/**
 * @description 封装详情页表单的“视图渲染”和“编辑功能”的核心逻辑
 * @param {Ref<Array>} formConfigs - 表单字段的配置数组
 * @param {Ref<Object>} formModel - 表单数据的响应式引用
 * @param {Ref<Object>} detailData - 从API获取的原始详情数据的响应式引用
 * @param {Ref<boolean>} canSubmit - 是否可提交的标志
 * @param {string} uploadUrl - 文件上传地址
 * @param {Function} getHeaders - 获取上传请求头函数
 * @param {Function} handleImageUploadChange - 图片上传状态变更回调
 * @param {Function} handleImagePreview - 图片预览回调
 * @returns {Object} 包含表单渲染所需的所有状态和方法
 */
export function useDetailForm(formConfigs, formModel, detailData, canSubmit, uploadUrl, getHeaders, handleImageUploadChange, handleImagePreview) {

  // --- 数据双向转换逻辑 ---

  // 侦听从API获取的原始数据, 并将其转换为适用于表单组件的数据格式
  watch(detailData, (newDetail) => {
    const model = newDetail ? JSON.parse(JSON.stringify(newDetail)) : {};
    // 如果是可提交状态, 需要特殊处理图片上传字段, 将字符串路径转换为Upload组件所需的数组格式
    if (canSubmit.value && newDetail?.statusCode === 'submit') {
        formConfigs.value.forEach(field => {
            if (field.fieldType === 'imageUpload') {
                const path = model[field.field];
                model[field.field] = typeof path === 'string' && path
                    ? [{
                        uid: getRandom(10),
                        name: '图片',
                        status: 'done',
                        url: getFileAccessHttpUrl(path),
                        response: { status: 'history', message: path }
                    }]
                    : [];
            }
        });
    }
    formModel.value = model;
  }, { deep: true, immediate: true });

  /**
   * @description 准备提交数据。将表单数据转换回API所需的格式。
   * @returns {Object} 清理和格式化后的表单数据
   */
  const getAllData = () => {
    const params = JSON.parse(JSON.stringify(formModel.value || {}));
    formConfigs.value.forEach(item => {
      // 将图片上传字段从数组格式转换回字符串路径
      if (item.fieldType === 'imageUpload') {
        params[item.field] = params[item.field]?.[0]?.response?.message || null;
      }
    });
    return params;
  };


  // --- 视图渲染逻辑 ---

  /**
   * @description (计算属性) 生成用于“查看模式”的字段数组。
   * 将原始数据格式化为最终用户看到的字符串。
   */
  const displayFields = computed(() => {
    if (!formModel.value || !formConfigs.value) return [];
    return formConfigs.value.map(config => {
      const rawValue = formModel.value[config.field];
      const getDisplayValue = () => {
        switch (config.fieldType) {
          case 'select': return getSelectDisplayValue(config, rawValue);
          case 'date': return getDataDisplayValue(rawValue);
          case 'imageUpload': return getImgUrl(rawValue, config.defaultImgFn, formModel.value);
          case 'slot': return '[slot]'; // 插槽由模板直接渲染
          default: return config.isMask ? maskMiddle(rawValue) : (rawValue || '-');
        }
      };
      return { label: config.label, value: getDisplayValue(), type: config.fieldType, field: config.field, span: config.span };
    });
  });

  /**
   * @description 为动态组件生成所需的props对象
   * @param {Object} item - 单个字段的配置对象
   * @param {Function} handleSelectChange - select组件的change事件回调
   * @returns {Object} 传递给动态组件的props
   */
  const getComponentProps = (item, handleSelectChange) => {
    const baseProps = {
      style: { width: '386px' },
      placeholder: item.placeholder || `${item.fieldType === 'select' ? '请选择' : '请输入'}${item.label}`,
      disabled: item.disabled,
      allowClear: true,
    };

    switch (item.fieldType) {
      case 'select':
        return {
          ...baseProps,
          options: item.options || selectOptions(item.dictKey),
          mode: item.selectMode,
          filterOption: item.remoteSearch ? false : (input, option) => option.label?.toLowerCase().includes(input.toLowerCase()),
          loading: item.loading,
          onChange: (v, option) => handleSelectChange(v, item, option),
        };
      case 'date':
        return {
          ...baseProps,
          disabledDate: (current) => current && current < dayjs().subtract(1, 'month'),
          valueFormat: item.valueFormat || 'YYYY-MM-DD HH:mm:ss',
          showTime: item.showTime,
        };
      case 'textarea':
        return {
          ...baseProps,
          rows: item.rows || 4,
          maxlength: item.maxLength,
          showCount: true,
        };
      case 'imageUpload':
        return {
          name: item.uploadName || 'file',
          listType: 'picture-card',
          class: 'custom-image-uploader',
          action: uploadUrl,
          headers: getHeaders(),
          data: { biz: 'temp' },
          maxCount: item.maxCount || 1,
          beforeUpload: item.beforeUpload || (file => !file.type.includes('image') ? (message.info('请上传图片'), false) : true),
          onChange: (info) => handleImageUploadChange(info, item),
          onPreview: handleImagePreview,
        };
      default: // input
        return baseProps;
    }
  };

  return {
    displayFields,      // {ComputedRef<Array>} “查看”模式的字段
    formComponentMap,   // {Object} “编辑”模式的动态组件映射
    getComponentProps,  // {Function} 获取动态组件props的函数
    getAllData,         // {Function} 获取用于提交的表单数据
  };
}