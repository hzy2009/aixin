import { ref } from 'vue';

/**
 * @description 一个用于处理文件对象（File Object）并返回其 Base64 字符串的辅助函数。
 * 主要用于在图片上传前生成本地预览。
 * @param {File} file - 用户选择的文件对象。
 * @returns {Promise<string>} 一个解析为 Base64 数据URL的 Promise。
 */
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * @description 这是一个封装了图片预览模态框所有状态和逻辑的组合式API。
 * @returns {object} 包含预览模态框的状态 ref 和控制函数的对象。
 */
export function useImagePreview() {
  // 控制模态框是否显示
  const previewVisible = ref(false);
  // 模态框中显示的图片URL
  const previewImage = ref('');
  // 模态框的标题
  const previewTitle = ref('');

  /**
   * @description 打开预览模态框并设置其内容。
   * @param {object} file - Ant Design Upload 组件提供的文件对象，包含 url 或 originFileObj。
   */
  const handleImagePreview = async (file) => {
    // 如果文件没有URL且没有本地预览，则生成Base64用于预览
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewTitle.value = file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : '预览');
    previewVisible.value = true;
  };

  /**
   * @description 关闭预览模态框。
   */
  const handlePreviewCancel = () => {
    previewVisible.value = false;
  };

  return {
    previewVisible,      // {ref<boolean>} 模态框可见性状态
    previewImage,        // {ref<string>}  预览图片的URL
    previewTitle,        // {ref<string>}  预览模态框的标题
    handleImagePreview,  // {function}     打开预览的函数
    handlePreviewCancel, // {function}     关闭预览的函数
  };
}