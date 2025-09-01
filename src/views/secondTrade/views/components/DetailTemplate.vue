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
              <span class="price-amount">{{props.product.purchaseMethod == 'PRICE_ON_REQUEST' ? '**,***,***' : priceInfo.price }}</span>
              <!-- <span class="price-unit">{{ priceInfo.unit }}</span> -->
              <span class="price-unit">元<span v-if="props.product.purchaseMethod == 'AUCTION'">起拍</span><span class="expiredDateText">(含税价)</span></span>
              <span v-if="props.product.purchaseMethod == 'AUCTION'" class="expiredDateText">竞拍截止日期: {{ props.product.expireDate }}</span>
            </div>
          </div>

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
          <!-- <div v-if="pageConfig.showPostedBy">需求发布者: {{ props.product.postedBy }}</div> -->
        </div>
      </div>

      <!-- 2. Bottom Section: Product Details and Specifications -->
      <div class="product-details-section">
        <div class="details-title-bar">
          <h3 class="details-title-text">{{ pageConfig.productDetailsTitle || '产品详情' }}</h3>
        </div>
        <div class="details-content-wrapper">
          <div v-if="productDetailsHtml" class="rich-text-description">{{ productDetailsHtml }}</div>
          <div v-if="specifications.length" class="specifications-list">
            <div v-for="spec in specifications" :key="spec.label" class="spec-item">
              <span class="spec-label">{{ spec.label }}：</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息购买" actionText="联系平台购买" :customFields="customFields"></PhoneAndEmailModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Tag as ATag, InputNumber as AInputNumber, Button as AButton, message } from 'ant-design-vue';
import defaultImagePlaceholder from '@/assets/images/fallback/detailFall.jpg'; // 准备一个占位图
import { safeGet } from '@/utils/index'; // 引入我们自己的工具函数
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { selectOptions, getFileAccessHttpUrl } from '@/utils/index';
import { useModalStore } from '@/store/modalStore'; 
import defHttp from '@/utils/http/axios'
const modalStore = useModalStore();


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
const customFields = ref([]);

// --- Computed properties to safely extract product using pageConfig and safeGet ---

/**
 * 安全提取产品数据
 * @param {Object} config - 配置对象
 * @param {string} config.field - 字段路径
 * @param {Function} config.formatter - 格式化函数
 * @param {*} config.defaultValue - 默认值
 * @returns {*} 提取的值
 */
const extractData = (config) => {
  // 参数验证
  if (!config || typeof config !== 'object') {
    return '-';
  }
  
  // 如果没有字段配置，返回默认值
  if (!config.field) {
    return config.defaultValue !== undefined ? config.defaultValue : '-';
  }
  
  try {
    // 使用 safeGet 安全获取值
    const value = safeGet(props.product, config.field, config.defaultValue);
    
    // 值为空时返回默认值
    if (value === null || value === undefined || value === '') {
      return config.defaultValue !== undefined ? config.defaultValue : '-';
    }
    
    // 应用格式化函数
    if (typeof config.formatter === 'function') {
      return config.formatter(value, props.product);
    }
    
    return value;
  } catch (error) {
    console.error('提取数据时发生错误:', error, config);
    return config.defaultValue !== undefined ? config.defaultValue : '-';
  }
};
const isEdit = computed(() => props.pageConfig.pageState == 'edit');
const title = computed(() => extractData(props.pageConfig.title));
const mainImage = computed(() => {
  const imageUrl = extractData(props.pageConfig.mainImage);
  return imageUrl ? getFileAccessHttpUrl(imageUrl) : defaultImagePlaceholder
});
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
const productDetailsHtml = computed(() => extractData({
  field: 'description',
}));

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
        const purchaseMethodMap = selectOptions('purchase_method').reduce((acc, { value: key, label }) => ({ ...acc, [key]: label }), {});
        const text = purchaseMethodMap[value] || '固定价，不可议价';
        return text;
      },
      defaultValue: '固定价，不可议价'
    }),
    price: extractData({
      field: 'priceExcludingTax',
      formatter: (value) => {
        if (props.product.purchaseMethod === 'PRICE_ON_REQUEST') return '**,***,***'
        return value ? Number(value).toLocaleString() : '0.00'
      }
    }),
    // unit: extractData({ field: 'unit' }),  
    quantity: extractData({ field: 'quantity' }) || 0,
  };
});

const isPurchasable = computed(() => priceInfo.value.quantity > 0);
const phoneAndEmailModal = ref();

/**
 * 处理购买操作
 */
const handlePurchase = async () => {
  // 验证商品可购买性
  if (!isPurchasable.value) {
    message.warn('该商品库存不足，无法购买');
    return;
  }
  
  // 验证产品信息
  if (!props.product || !props.product.purchaseMethod) {
    message.error('产品信息不完整，无法购买');
    return;
  }
  
  try {
    // 根据购买方式配置自定义字段
    const customFieldsMap = {
      'FIXED_PRICE': [
        { 
          min: 1, 
          max: props.product.quantity, 
          field: 'quantity', 
          placeholder: '请输入数量', 
          defaultValue: purchaseQuantity.value, 
          type: 'number', 
          rules: [{ required: true, message: '请输入数量' }] 
        },
        { 
          field: 'remark', 
          placeholder: '请填写您的优势或者需要咨询的问题', 
          type: 'textarea',
        },
      ],
      'NEGOTIABLE': [
        { 
          field: 'price', 
          placeholder: '请输入价格', 
          type: 'number',
          rules: [{ required: true, message: '请输入价格' }]
        },
        { 
          min: 1, 
          max: props.product.quantity, 
          field: 'quantity', 
          placeholder: '请输入数量', 
          defaultValue: purchaseQuantity.value, 
          type: 'number', 
          rules: [{ required: true, message: '请输入数量' }] 
        },
        { 
          field: 'remark', 
          placeholder: '请填写您的优势或者需要咨询的问题', 
          type: 'textarea',
        },
      ],
      'PRICE_ON_REQUEST': [
        { 
          min: 1, 
          max: props.product.quantity, 
          field: 'quantity', 
          placeholder: '请输入数量', 
          defaultValue: purchaseQuantity.value, 
          type: 'number', 
          rules: [{ required: true, message: '请输入数量' }] 
        },
        { 
          field: 'remark', 
          placeholder: '请填写您的优势或者需要咨询的问题', 
          type: 'textarea',
        },
      ],
      'AUCTION': [
        { 
          field: 'price', 
          placeholder: '请输入竞价', 
          type: 'number',
          rules: [{ required: true, message: '请输入竞价' }]
        },
        { 
          min: 1, 
          max: props.product.quantity, 
          field: 'quantity', 
          placeholder: '请输入数量', 
          defaultValue: purchaseQuantity.value, 
          type: 'number', 
          rules: [{ required: true, message: '请输入数量' }] 
        },
        { 
          field: 'remark', 
          placeholder: '请填写您的优势或者需要咨询的问题', 
          type: 'textarea',
        },
      ],
    };
    
    // 获取对应购买方式的字段配置
    const fields = customFieldsMap[props.product.purchaseMethod];
    if (!fields) {
      message.error(`不支持的购买方式: ${props.product.purchaseMethod}`);
      return;
    }
    
    customFields.value = fields;
    
    // 打开弹窗
    if (phoneAndEmailModal.value?.openModal) {
      phoneAndEmailModal.value.openModal();
    } else {
      message.error('弹窗组件未正确加载');
    }
  } catch (error) {
    console.error('处理购买操作时发生错误:', error);
    message.error('系统错误，请稍后重试');
  }
};
/**
 * 处理购买完成
 * @param {Object} data - 表单数据
 */
const handleFinish = async (data) => {
  const productId = props.product?.id;
  
  if (!productId) {
    message.error('产品信息缺失，无法提交');
    return;
  }
  
  if (!data || typeof data !== 'object') {
    message.error('请填写完整信息');
    return;
  }
  
  try {
    isSubmitting.value = true;
    let url = `${props.pageConfig.newTodoUrl}/${productId}`;
    const response = await defHttp.post({
      url,
      data
    });
    
    if (response.success) {
      phoneAndEmailModal.value?.handleClose?.();
      
      const successConfig = {
        title: '一键敲门成功',
        message: '一键敲门后，客服人员将在30分钟内与您联系',
        contactInfo: { 
          name: '陈靖玮', 
          phone: '4000118892', 
          email: 'info-service@icshare.com' 
        },
        buttonText: '返回列表',
        showButton: false,
        onAction: props.pageConfig.successAction, // Store默认处理返回首页
      };
      
      modalStore.showSuccessPrompt(successConfig);
    } else {
      message.error(response.message || '提交失败，请稍后重试');
    }
  } catch (error) {
    console.error('提交失败:', error);
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
    padding-bottom: 10px;
    margin-bottom: 10px;
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
        min-width: 80px;
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
    padding: 26px 20px;
    font-size: 14px;
    line-height: 22px;
    // color: @text-color-secondary;
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
</style>