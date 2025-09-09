// src/views/secondTrade/composables/useImageGallery.js
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getFileAccessHttpUrl } from '@/utils/index';
import defaultImagePlaceholder from '@/assets/images/fallback/detailFall.png';

/**
 * 处理产品图片画廊逻辑
 * @param {Object} product - 产品数据对象 (ref)
 * @returns {Object} 包含图片画廊相关状态和方法的对象
 */
export function useImageGallery(product) {
  const currentImageIndex = ref(0); // 当前选中的图片索引
  const thumbnailStartIndex = ref(0); // 缩略图起始索引
  const isImageModalVisible = ref(false); // 图片放大弹窗可见性
  const isZoomHintVisible = ref(false); // 放大提示文字可见性

  // 图片列表处理
  const imageList = computed(() => {
    const imageUrl = product.value.imageUrl;
    const productImageList = imageUrl && imageUrl.length > 0 ? imageUrl.split(',') : [];
    if (Array.isArray(productImageList) && productImageList.length > 0) {
      return productImageList.map(url => getFileAccessHttpUrl(url));
    }
    // 如果没有产品图片，使用默认占位图
    return [defaultImagePlaceholder];
  });

  const mainImage = computed(() => {
    if (imageList.value.length > 0) {
      return imageList.value[currentImageIndex.value];
    }
    return defaultImagePlaceholder;
  });

  // 计算可见的缩略图（最多4个）
  const visibleThumbnails = computed(() => {
    return imageList.value.slice(thumbnailStartIndex.value, thumbnailStartIndex.value + 4);
  });

  // 选择图片
  const selectImage = (index) => {
    currentImageIndex.value = index;
  };

  // 缩略图翻页
  const scrollThumbnails = (direction) => {
    if (direction === 'up' && thumbnailStartIndex.value > 0) {
      thumbnailStartIndex.value = Math.max(0, thumbnailStartIndex.value - 4);
    }
    else if (direction === 'down' && thumbnailStartIndex.value + 4 < imageList.value.length) {
      thumbnailStartIndex.value = Math.min(imageList.value.length - 4, thumbnailStartIndex.value + 4);
    }
  };

  // 图片放大功能
  const showImageModal = () => {
    document.body.style.overflow = 'hidden'; // 禁止页面滚动
    isImageModalVisible.value = true;
  };

  const closeImageModal = () => {
    document.body.style.overflow = ''; // 恢复页面滚动
    isImageModalVisible.value = false;
  };

  // 放大提示文字控制
  const showZoomHint = () => {
    isZoomHintVisible.value = true;
  };

  const hideZoomHint = () => {
    isZoomHintVisible.value = false;
  };

  // Note: The original component had onMounted/onUnmounted for modalElement.
  // With Teleport, if the target element already exists in index.html (e.g., <div id="teleport-target"></div>),
  // or if Teleport is used to mount directly to 'body', manual element creation/removal is often not needed.
  // However, to maintain exact original behavior, we'll keep the overflow control.
  // The modalElement ref and its lifecycle hooks are not strictly necessary for Teleport itself,
  // but the overflow control is.

  return {
    currentImageIndex,
    thumbnailStartIndex,
    isImageModalVisible,
    isZoomHintVisible,
    imageList,
    mainImage,
    visibleThumbnails,
    selectImage,
    scrollThumbnails,
    showImageModal,
    closeImageModal,
    showZoomHint,
    hideZoomHint,
  };
}