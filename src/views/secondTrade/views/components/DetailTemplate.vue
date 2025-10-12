<template>
  <!-- 页面主容器 -->
  <div class="product-detail-page-container">
    <!-- 产品详情内容包装器 -->
    <div class="product-detail-wrapper">
      <!-- 1. 顶部区域: 图片画廊和购买信息 -->
      <div class="product-header-section">
        <!-- 产品图片画廊 -->
        <div class="product-image-gallery">
          <!-- 缩略图导航容器，当图片数量大于1时显示 -->
          <div class="thumbnail-container" v-if="imageList.length > 1">
            <!-- 向上滚动缩略图按钮 -->
            <button
              class="thumbnail-nav-btn prev"
              :class="{ disabled: thumbnailStartIndex === 0 }"
              @click="scrollThumbnails('up')"
              :disabled="thumbnailStartIndex === 0"
            >
              <UpOutlined/>
            </button>

            <!-- 缩略图列表 -->
            <div class="thumbnail-images">
              <div 
                v-for="(image, index) in visibleThumbnails" 
                :key="thumbnailStartIndex + index"
                class="thumbnail-item"
                :class="{ active: currentImageIndex === thumbnailStartIndex + index }"
                @click="selectImage(thumbnailStartIndex + index)"
              >
                <img :src="image" :alt="`缩略图 ${thumbnailStartIndex + index + 1}`" />
              </div>
            </div>
            
            <!-- 向下滚动缩略图按钮 -->
            <button 
              class="thumbnail-nav-btn next"
              :class="{ disabled: thumbnailStartIndex + 4 >= imageList.length }"
              @click="scrollThumbnails('down')"
              :disabled="thumbnailStartIndex + 4 >= imageList.length"
            >
              <DownOutlined />
            </button>
          </div>
          
          <!-- 主图片显示区域，点击可放大 -->
          <div class="main-image-wrapper" @click="showImageModal">
            <img :src="mainImage" :alt="title" class="main-image" />
            <!-- 放大镜图标和提示 -->
            <div class="zoom-icon" @mouseenter="showZoomHint" @mouseleave="hideZoomHint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <div class="zoom-hint" :class="{ visible: isZoomHintVisible }">点击放大</div>
            </div>
          </div>
        </div>

        <!-- 产品购买信息区域 -->
        <div class="product-purchase-info" :class="{ 'padding-top-40': !isEdit}">
          <!-- 产品标签，根据 tags 数组显示 -->
          <div v-if="tags.length" class="product-tags" >
            <a-tag v-for="tag in tags" :key="tag" class="custom-tag">{{ tag }}</a-tag>
          </div>
          <!-- 产品标题 -->
          <h1 class="product-title">{{ title }}</h1>
          <!-- 产品基本信息列表 -->
          <div v-if="basicInfo.length" class="product-basic-info">
            <p v-for="info in basicInfo" :key="info.label" class="info-line">
              <span class="info-label">{{ info.label }}：</span>
              <span class="info-value" :class="{ 'highlight': info.highlight }">{{ info.value }}</span>
            </p>
          </div>

          <!-- 价格信息区域 -->
          <div class="price-section" :class="{ 'padding-bottom-40': !isEdit}">
            <div class="price-header">
              <span class="price-label">{{ priceInfo.label }}</span>
            </div>
            <div class="price-value-wrapper">
              <span class="price-amount">{{props.product.purchaseMethod == 'PRICE_ON_REQUEST' ? '***' : priceInfo.price }}</span>
              <span class="price-unit">元
                <span v-if="props.product.purchaseMethod == 'AUCTION'">起拍</span>
                <span class="expiredDateText" v-if="!['AUCTION', 'PRICE_ON_REQUEST'].includes(props.product.purchaseMethod)">(含税单价)</span>
              </span>
              <span v-if="props.product.purchaseMethod == 'AUCTION'" class="expiredDateText">竞拍截止日期: {{ props.product.expireDate }}</span>
            </div>
          </div>

          <!-- 购买数量输入，仅在编辑模式下显示 -->
          <div class="quantity-section" v-if="isEdit">
            <span class="quantity-label">购买数量</span>
            <a-input-number
              v-model:value="purchaseQuantity"
              :min="1"
              :max="priceInfo.quantity"
              :step="1"
              :precision="0"
              :parser="value => value.replace(/\D/g, '')"
              :formatter="value => `${value}`"
              class="quantity-input"
              :disabled="!isPurchasable"
            />
            <span class="quantity-info">库存：<span class="quantity-value">{{ priceInfo.quantity }}个</span></span>
          </div>

          <!-- 操作按钮，仅在编辑模式下显示 -->
          <div class="action-buttons" v-if="isEdit">
            <a-button
              type="primary"
              danger
              class="purchase-button"
              size="large"
              @click="handlePurchase"
              :loading="isSubmitting"
              :disabled="!isPurchasable"
            >
              {{ actionText }}
            </a-button>
          </div>
        </div>
      </div>

      <!-- 2. 底部区域: 产品详情和规格 -->
      <div class="product-details-section">
        <div class="details-title-bar">
          <h3 class="details-title-text">{{ pageConfig.productDetailsTitle || '产品详情' }}</h3>
        </div>
        <div class="details-content-wrapper">
          <!-- 富文本描述，如果存在则显示 -->
          <div v-if="productDetailsHtml" class="rich-text-description">{{ productDetailsHtml }}</div>
          <!-- 产品规格列表，如果存在则显示 -->
          <div v-if="specifications.length" class="specifications-list">
            <div v-for="spec in specifications" :key="spec.label" class="spec-item">
              <span class="spec-label">{{ spec.label }}：</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 电话和邮箱模态框组件 -->
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息购买" :actionText="actionText" :customFields="customFields"></PhoneAndEmailModal>

    <!-- 图片放大弹窗，使用 Teleport 渲染到 body 元素下 -->
    <Teleport to="body">
      <div v-if="isImageModalVisible" class="image-modal" @click="closeImageModal">
        <!-- 模态框内容区域 -->
        <div class="modal-content" @click.stop>
          <img :src="mainImage" :alt="title" class="modal-image" />
          <!-- 关闭模态框按钮 -->
          <button class="close-button" @click="closeImageModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
/**
 * @file DetailTemplate.vue
 * @description 共济共享模块的产品详情模板组件。
 * 该组件用于展示产品的详细信息，包括图片画廊、基本信息、价格、购买操作以及产品规格。
 * 它通过组合式函数 (composables) 封装了数据处理、图片展示和购买逻辑。
 */

import { ref, computed, toRefs } from 'vue';
import { Tag as ATag, InputNumber as AInputNumber, Button as AButton } from 'ant-design-vue';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';

// 引入组合式函数 (Composables)，用于封装和复用业务逻辑
import { useProductData } from './composables/useProductData';
import { useImageGallery } from './composables/useImageGallery';
import { useProductPurchase } from './composables/useProductPurchase';

/**
 * 定义组件的 props。
 * @property {Object} product - 产品的详细数据对象。
 * @property {Object} pageConfig - 页面配置对象，定义了如何从 `product` 映射到UI，以及页面状态等。
 */
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({})
  },
  pageConfig: {
    type: Object,
    required: true,
    default: () => ({}) // 定义了如何从 `product` 映射到UI
  }
});

// 将 props 转换为响应式引用，以便传递给 composables，保持响应性
const { product, pageConfig } = toRefs(props);

// 使用 useProductData 组合式函数，处理产品数据的提取和格式化
const { title, tags, productDetailsHtml, basicInfo, specifications, priceInfo } = useProductData(product, pageConfig);

// 使用 useImageGallery 组合式函数，处理图片画廊的逻辑
const {
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
} = useImageGallery(product);

// 使用 useProductPurchase 组合式函数，处理产品购买相关的逻辑
const {
  purchaseQuantity,
  isSubmitting,
  phoneAndEmailModal,
  customFields,
  actionText,
  isPurchasable,
  handlePurchase,
  handleFinish,
} = useProductPurchase(product, pageConfig, priceInfo);

/**
 * 计算属性，判断当前页面是否处于编辑状态。
 * @type {ComputedRef<boolean>}
 */
const isEdit = computed(() => pageConfig.value.pageState == 'edit');

</script>

<style scoped lang="less">
// 样式与之前版本保持一致，以实现100%还原
@import '@/assets/styles/_variables.less';

.product-detail-page-container {
  background-color: #f8f9fa;
  .product-detail-wrapper{
    background-color: @background-color-base;
    padding: 20px;
  }
}

// 图片放大弹窗样式
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
  overflow: hidden;

  .modal-content {
    position: relative;
    width: 80vw;
    height: 80vh;
    max-width: 80vw;
    max-height: 80vh;
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .modal-image {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
      display: block;
      flex-shrink: 0;
      flex-grow: 0;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
      z-index: 10000;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      svg {
        color: white;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .image-modal {
    .modal-content {
      width: 90vw;
      height: 70vh;
      max-width: 90vw;
      max-height: 70vh;

      .modal-image {
        max-width: 100%;
        max-height: 100%;
      }

      .close-button {
        top: 5px;
        right: 5px;
      }
    }
  }
}

// 主图上的放大镜图标
.main-image-wrapper {
  position: relative;
  cursor: pointer;

  .zoom-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;
    z-index: 10;
    cursor: pointer;

    svg {
      color: white;
    }

    // 右下角提示文字
    .zoom-hint {
      position: absolute;
      bottom: 35px;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10;
      white-space: nowrap;
      pointer-events: none;

      &.visible {
        opacity: 1;
      }
    }
  }

  &:hover {
    .zoom-icon {
      opacity: 1;
    }
  }
}

.product-header-section {
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
}

.product-image-gallery {
  display: flex;
  gap: 12px;

  .thumbnail-container {
    width: 80px;
    height: 400px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .thumbnail-nav-btn {
      width: 80px;
      height: 24px;
      background-color: #EAEAEA;
      border: 1px solid #9AA0A3;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666;
      flex-shrink: 0;

      &:hover:not(.disabled) {
        background-color: #fff;
        border-color: @primary-color;
        color: @primary-color;
      }

      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
        background-color: #f5f5f5;
      }

      svg {
        width: 12px;
        height: 8px;
      }

      &.prev {
        margin-bottom: 6px;
      }

      &.next {
        margin-top: 6px;
      }
    }

    .thumbnail-images {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .thumbnail-item {
        width: 80px;
        height: 80px;
        border: 1px solid #EAEAEA;
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
        transition: border-color 0.3s ease;

        &.active {
          border-color: @primary-color;
        }

        &:hover {
          border-color: @primary-color;
          opacity: 0.8;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #FAFAFA;
        }
      }
    }
  }
  
  .main-image-wrapper {
    width: 400px;
    height: 400px;
    background-color: #FAFAFA;
    border: 1px solid @border-color-light;
    display: flex;
    align-items: center;
    justify-content: center;

    img.main-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
}

.product-purchase-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  .product-tags {
    margin-bottom: 10px;
    .custom-tag {
      background-color: transparent;
      border-color: EAEAEA;
      color: @primary-color;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 4px;
    }
  }

  .product-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;
    color: #000000;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    min-height: calc( 1em * 2);
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: auto;
  }

  .product-basic-info {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid @border-color-light;
    .info-line {
      font-size: 14px;
      font-family: PingFang SC;
      line-height: 16px;
      margin-bottom: 12px;

      font-family: PingFang SC;
      font-weight: 400;
      font-style: Bold;
      leading-trim: NONE;

      
      &:last-child { margin-bottom: 0; }
      .info-label {
        color: #000000;
        display: inline-block;
        min-width: 90px;
      }
      .info-value {
        color: #000000;
        &.highlight {
          color: @primary-color;
        }
      }
    }
  }

  .price-section {
      margin-bottom: 10px;

    .price-header .price-label {
      font-size: 14px;
      color: #9AA0A3;
    }
    .price-value-wrapper {
      display: flex;
      align-items: baseline;
      margin-top: 10px;
      font-size: 35px;
      line-height: 35px;
      color: #000000;
      .price-amount {
        margin-right: 6px;
      }
      .price-unit {
      }
      .expiredDateText{
        margin-left: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
      }
    }
  }

  .quantity-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .quantity-label {
      font-size: 14px;
      color: @text-color-secondary;
      margin-right: @spacing-md;
    }
    .quantity-input {
      width: 120px;
      text-align: center;
      :deep(.ant-input-number-input) {
        text-align: center;
      }
    }
    .quantity-info {
      font-size: 13px;
      color: @text-color-secondary;
      margin-left: @spacing-md;
      .quantity-value {
        color: @primary-color;
      }
    }
  }

  .action-buttons {
    // margin-top: auto;
    .purchase-button {
      background-color: @primary-color;
      border-color: @primary-color;
      height: 44px;
      min-width: 160px;
      font-size: 16px;
      &:hover {
        background-color: darken(@primary-color, 8%);
        border-color: darken(@primary-color, 8%);
      }
      &[disabled] {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }
    }
  }
}
.details-title-bar {
    padding-bottom: @spacing-xs;
    border-bottom: 1px solid @border-color-light;
    position: relative;

    .details-title-text {
     color: #656C74;
      margin: 0;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;
      letter-spacing: 0px;

      display: inline-block;
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background-color: @primary-color;
        position: absolute;
        bottom: -8px;
        left: 0;
        z-index: 1;
      }
    }
  }
.product-details-section {
  
  .details-content-wrapper {
    padding: 26px 20px;
    font-size: 14px;
    line-height: 22px;
      color: #272A30;

    .rich-text-description {  
      font-family: PingFang SC;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 22px;
      letter-spacing: 0%;
      text-align: justify;

      margin-bottom: @spacing-md;
      color: #272A30;
      :deep(p) { margin-bottom: 1em; }
    }

    .specifications-list {
      .spec-item {
        display: flex;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #656C74;
        .spec-label {
          min-width: 120px;
          flex-shrink: 0;
          text-align: right;
          padding-right: 10px;
          color: #656C74;
        }
        .spec-value {
          color: @text-color-base;
          flex-grow: 1;
          color: #272A30;
        }
      }
    }
  }
}
.product-similar-section{
  margin-top: 20px;
}
.padding-bottom-40{
  padding-bottom: 40px;
}
.padding-top-40{
  padding-top: 40px;
}
</style>