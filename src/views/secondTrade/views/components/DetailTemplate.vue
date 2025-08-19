<template>
  <div class="product-detail-page-container">
    <div class="product-detail-wrapper">
      <!-- 1. Top Section: Image and Purchase Info -->
      <div class="product-header-section">
        <div class="product-image-gallery">
          <div class="main-image-wrapper">
            <img :src="mainImage" :alt="title" class="main-image" />
          </div>
        </div>

        <div class="product-purchase-info">
          <div v-if="tags.length" class="product-tags">
            <a-tag v-for="tag in tags" :key="tag" class="custom-tag">{{ tag }}</a-tag>
          </div>
          <h1 class="product-title">{{ title }}</h1>

          <div v-if="basicInfo.length" class="product-basic-info">
            <p v-for="info in basicInfo" :key="info.label" class="info-line">
              <span class="info-label">{{ info.label }}：</span>
              <span class="info-value" :class="{ 'highlight': info.highlight }">{{ info.value }}</span>
            </p>
          </div>

          <div class="price-section">
            <div class="price-header">
              <span class="price-label">{{ priceInfo.label }}</span>
            </div>
            <div class="price-value-wrapper">
              <span class="price-amount">{{ priceInfo.price }}</span>
              <!-- <span class="price-unit">{{ priceInfo.unit }}</span> -->
              <span class="price-unit">元</span>
            </div>
          </div>

          <div class="quantity-section">
            <span class="quantity-label">购买数量</span>
            <a-input-number
              v-model:value="purchaseQuantity"
              :min="1"
              :max="priceInfo.stock"
              class="quantity-input"
              :disabled="!isPurchasable"
            />
            <span class="stock-info">库存：<span class="stock-value">{{ priceInfo.stock }}个</span></span>
          </div>

          <div class="action-buttons">
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
          <div v-if="props.product.purchaseMethod == 'AUCTION'">竞拍截止日期: {{ props.product.expiredDate }}</div>
        </div>
      </div>

      <!-- 2. Bottom Section: Product Details and Specifications -->
      <div class="product-details-section">
        <div class="details-title-bar">
          <h3 class="details-title-text">{{ pageConfig.productDetailsTitle || '产品详情' }}</h3>
        </div>
        <div class="details-content-wrapper">
          <div v-if="productDetailsHtml" class="rich-text-description" v-html="productDetailsHtml"></div>
          <div v-if="specifications.length" class="specifications-list">
            <div v-for="spec in specifications" :key="spec.label" class="spec-item">
              <span class="spec-label">{{ spec.label }}：</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3.类似商品 -->
    <div class="product-similar-section">
      <div class="details-title-bar">
        <h3 class="details-title-text">{{ '类似商品' }}</h3>
      </div>
      <div class="details-content-wrapper">
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Tag as ATag, InputNumber as AInputNumber, Button as AButton, message } from 'ant-design-vue';
import defaultImagePlaceholder from '@/assets/images/fallback/detailFall.jpg'; // 准备一个占位图
import { safeGet } from '@/utils/index'; // 引入我们自己的工具函数
import { selectOptions } from '@/utils/index';

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

const purchaseQuantity = ref(1);
const isSubmitting = ref(false); // 用于按钮加载状态
const actionText = computed(() => {
   const purchaseMethodMap = selectOptions('purchase_method');
   return purchaseMethodMap[props.product.purchaseMethod] || '立即购买';
});

// --- Computed properties to safely extract product using pageConfig and safeGet ---

// 辅助函数，现在使用我们自己的 safeGet
const extractData = (config) => {
  if (!config || !config.field) return config.defaultValue !== undefined ? config.defaultValue : '-';
  // 使用 safeGet
  const value = safeGet(props.product, config.field, config.defaultValue);
  if (value === null || value === undefined) return config.defaultValue !== undefined ? config.defaultValue : '-';
  if (typeof config.formatter === 'function') {
    return config.formatter(value, props.product);
  }
  return value;
};
const pageState = computed(() => props.pageConfig.pageState);
const title = computed(() => extractData(props.pageConfig.title));
const mainImage = computed(() => extractData(props.pageConfig.mainImage) || defaultImagePlaceholder);
const tags = computed(() => {
  if (!Array.isArray(props.pageConfig.tags)) return [];
  
  return props.pageConfig.tags
    .map(tagConfig => {
      const value = extractData(tagConfig);
      if (value && value !== '-') {
        return tagConfig.prefix ? `${tagConfig.prefix}${value}` : value;
      }
      return null; // Return null for invalid values
    })
    .filter(tag => tag !== null); // Filter out the nulls
});
const productDetailsHtml = computed(() => extractData(props.pageConfig.productDetailsHtml));

const basicInfo = computed(() => {
  if (!Array.isArray(props.pageConfig.basicInfo)) return [];
  return props.pageConfig.basicInfo.map(infoConfig => ({
    label: infoConfig.label,
    value: extractData(infoConfig),
    highlight: infoConfig.highlight || false,
  }))
  // .filter(info => info.value !== '-'); // 优化：如果值不存在，则不显示该行
});

const specifications = computed(() => {
  if (!Array.isArray(props.pageConfig.specifications)) return [];
  return props.pageConfig.specifications.map(specConfig => ({
    label: specConfig.label,
    value: extractData(specConfig),
  }))
});

const priceInfo = computed(() => {
  // const priceConfig = props.pageConfig.priceInfo || {};
  return {
    label: extractData({
      field: 'purchaseMethod',
      formatter: (value) => {
        const purchaseMethodMap = selectOptions('purchase_method');
        const text = purchaseMethodMap[value] || '固定价，不可议价';
        return text;
      },
      defaultValue: '固定价，不可议价'
    }),
    price: extractData({
      field: 'priceExcludingTax',
      formatter: (value) => value ? Number(value).toLocaleString() : '0.00'
    }),
    // unit: extractData({ field: 'unit' }),
    stock: extractData({ field: 'quantity' }) || 0,
  };
});

// const isPurchasable = computed(() => priceInfo.value.stock > 0);
const isPurchasable = true;

const handlePurchase = async () => {
  if (!isPurchasable.value) {
    message.warn('该商品库存不足，无法购买。');
    return;
  }
  isSubmitting.value = true;
  try {
    // TODO: 实现购买逻辑，例如调用 API
    console.log(`准备购买 ${purchaseQuantity.value} 个 ${title.value} (ID: ${props.product.id})`);
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('购买请求已提交！');
    // router.push('/order/confirmation'); // 跳转到订单确认页
  } catch (error) {
    console.error("购买失败:", error);
    message.error('购买失败，请稍后重试。');
  } finally {
    isSubmitting.value = false;
  }
};
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

.product-header-section {
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
}

.product-image-gallery {
  width: 400px;
  flex-shrink: 0;
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
      border-color: @primary-color;
      color: @primary-color;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: @border-radius-sm;
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
      
      &:last-child { margin-bottom: 0; }
      .info-label {
        color: #000000;
        display: inline-block;
        width: 80px;
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
      margin-top: 12px;
      font-size: 35px;
      line-height: 35px;
      color: #000000;
      .price-amount {
        margin-right: 6px;
      }
      .price-unit {
      }
    }
  }

  .quantity-section {
    display: flex;
    align-items: center;
    margin-bottom: @spacing-md;
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
    .stock-info {
      font-size: 13px;
      color: @text-color-secondary;
      margin-left: @spacing-md;
      .stock-value {
        color: @primary-color;
      }
    }
  }

  .action-buttons {
    margin-top: auto;
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
    padding: 30px 20px;
    font-size: 14px;
    line-height: 22px;
    // color: @text-color-secondary;
      color: #272A30;

    .rich-text-description {  
      margin-bottom: @spacing-xl;
      :deep(p) { margin-bottom: 1em; }
    }

    .specifications-list {
      .spec-item {
        display: flex;
        margin-bottom: 12px;
        &:last-child { margin-bottom: 0; }
        .spec-label {
          color: @text-color-secondary;
          width: 120px;
          flex-shrink: 0;
          text-align: right;
          padding-right: 10px;
        }
        .spec-value {
          color: @text-color-base;
          flex-grow: 1;
        }
      }
    }
  }
}
.product-similar-section{
  margin-top: 20px;
}
</style>