/**
 * @file useProductData.js
 * @description 封装二手交易模块中产品详情页的数据提取和格式化逻辑。
 * 该 composable 负责从原始产品数据中安全地提取和计算各种展示所需的信息，
 * 如标题、标签、基本信息、规格和价格信息，并进行相应的格式化处理。
 */

// src/views/secondTrade/composables/useProductData.js
import { computed } from 'vue';
import { safeGet, selectOptions, getFileAccessHttpUrl } from '@/utils/index';

/**
 * 封装产品数据提取和计算逻辑。
 * 提供了一系列计算属性，用于从产品数据和页面配置中安全地提取和格式化展示所需的信息。
 * @param {Object} product - 产品数据对象 (ref)，包含产品的原始详细信息。
 * @param {Object} pageConfig - 页面配置对象 (ref)，定义了如何提取和展示产品数据的规则。
 * @returns {Object} 包含各种计算属性的对象，如 title, tags, basicInfo, specifications, priceInfo 等。
 */
export function useProductData(product, pageConfig) {

  /**
   * 安全提取数据通用函数
   * @param {Object} config - 配置对象
   * @param {string} config.field - 字段路径
   * @param {Function} config.formatter - 格式化函数
   * @param {*} config.defaultValue - 默认值
   * @returns {*} 提取的值
   */
  const extractData = (config) => {
    if (!config || typeof config !== 'object') {
      return '-';
    }

    if (!config.field) {
      return config.defaultValue !== undefined ? config.defaultValue : '-';
    }

    try {
      const value = safeGet(product.value, config.field, config.defaultValue);

      if (value === null || value === undefined || value === '') {
        return config.defaultValue !== undefined ? config.defaultValue : '-';
      }

      if (typeof config.formatter === 'function') {
        return config.formatter(value, product.value);
      }

      return value;
    } catch (error) {
      console.error('提取数据时发生错误:', error, config);
      return config.defaultValue !== undefined ? config.defaultValue : '-';
    }
  };

  const title = computed(() => extractData(pageConfig.value.title));

  const tags = computed(() => {
    if (!Array.isArray(pageConfig.value.tags)) return [];

    return pageConfig.value.tags
      .map(tagConfig => {
        const value = extractData(tagConfig);
        if (value && value !== '-') {
          return tagConfig.prefix ? `${tagConfig.prefix}${value}` : value;
        }
        return null;
      })
      .filter(tag => tag !== null);
  });

  const productDetailsHtml = computed(() => extractData({
    field: 'description',
  }));

  const basicInfo = computed(() => {
    if (!Array.isArray(pageConfig.value.basicInfo)) return [];
    return pageConfig.value.basicInfo.map(infoConfig => ({
      label: infoConfig.label,
      value: extractData(infoConfig),
      highlight: infoConfig.highlight || false,
    }));
  });

  const specifications = computed(() => {
    if (!Array.isArray(pageConfig.value.specifications)) return [];
    return pageConfig.value.specifications.map(specConfig => ({
      label: specConfig.label,
      value: extractData(specConfig),
    }));
  });

  const priceInfo = computed(() => {
    return {
      label: extractData({
        field: 'purchaseMethod',
        formatter: (value) => {
          const purchaseMethodMap = selectOptions('purchase_method').reduce((acc, { value: key, label }) => ({ ...acc, [key]: label }), {});
          const text = purchaseMethodMap[value] || '';
          return text;
        },
        defaultValue: ''
      }),
      price: extractData({
        field: 'priceIncludingTax',
        formatter: (value) => {
          if (product.value.purchaseMethod === 'PRICE_ON_REQUEST') return '***';
          return value ? Number(value).toLocaleString() : '0.00';
        }
      }),
      quantity: extractData({ field: 'quantity' }) || 0,
    };
  });

  return {
    title,
    tags,
    productDetailsHtml,
    basicInfo,
    specifications,
    priceInfo,
    extractData // Expose extractData if needed by other composables or directly in the component
  };
}