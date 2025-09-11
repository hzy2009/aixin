/**
 * @file useProductPurchase.js
 * @description 封装二手交易模块中产品购买相关的逻辑。
 * 该 composable 负责处理不同购买方式（如固定价格、议价、询价、竞拍）的购买流程，
 * 包括购买数量管理、表单字段配置、弹窗显示以及购买请求的提交和结果处理。
 */

// src/views/secondTrade/composables/useProductPurchase.js
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';
import defHttp from '@/utils/http/axios';

/**
 * 处理产品购买逻辑。
 * 根据不同的购买方式（固定价格、议价、询价、竞拍）配置相应的购买表单字段，
 * 并处理购买弹窗的显示、购买请求的提交以及成功后的提示。
 * @param {Object} product - 产品数据对象 (ref)，包含产品的详细信息和购买方式。
 * @param {Object} pageConfig - 页面配置对象 (ref)，包含成功后的跳转或操作配置。
 * @param {Object} priceInfo - 价格信息 (computed from useProductData)，包含可购买数量等。
 * @returns {Object} 包含购买相关状态和方法的对象，供组件调用。
 */
export function useProductPurchase(product, pageConfig, priceInfo) {
  const modalStore = useModalStore();
  const authStore = useAuthStore();
  const purchaseQuantity = ref(1);
  const isSubmitting = ref(false); // 用于按钮加载状态
  const phoneAndEmailModal = ref(null); // 弹窗组件引用
  const customFields = ref([]);

  const actionText = computed(() => {
    const purchaseMethodMap = {
      FIXED_PRICE: '立即购买',
      AUCTION: '参与竞拍',
      NEGOTIABLE: '立即议价',
      PRICE_ON_REQUEST: '立即询价',
    };
    return purchaseMethodMap[product.value.purchaseMethod] || '立即购买';
  });

  const isPurchasable = computed(() => priceInfo.value.quantity > 0);

  /**
   * 处理购买操作
   */
  const handlePurchase = async () => {
    if (!authStore.isLogin) {
      modalStore.showLogin();
      return;
    }
    // 验证商品可购买性
    if (!isPurchasable.value) {
      message.warn('该商品库存不足，无法购买');
      return;
    }

    // 验证产品信息
    if (!product.value || !product.value.purchaseMethod) {
      message.error('产品信息不完整，无法购买');
      return;
    }

    try {
      // 根据购买方式配置自定义字段
      const customFieldsMap = {
        'FIXED_PRICE': [
          {
            min: 1,
            max: product.value.quantity,
            field: 'quantity',
            label: '购买数量',
            placeholder: '请输入数量',
            defaultValue: purchaseQuantity.value,
            type: 'number',
            rules: [{ required: true, message: '请输入数量' }]
          },
          {
            field: 'remark',
            label: '备注信息',
            placeholder: '请填写您的优势或者需要咨询的问题',
            type: 'textarea',
          },
        ],
        'NEGOTIABLE': [
          {
            field: 'price',
            label: '议价',
            placeholder: '请输入期望价格，只有一次议价机会',
            type: 'number',
            rules: [{ required: true, message: '请输入价格' }]
          },
          {
            min: 1,
            max: product.value.quantity,
            field: 'quantity',
            label: '购买数量',
            placeholder: '请输入数量',
            defaultValue: purchaseQuantity.value,
            type: 'number',
            rules: [{ required: true, message: '请输入数量' }]
          },
          {
            field: 'remark',
            label: '备注信息',
            placeholder: '请填写您的优势或者需要咨询的问题',
            type: 'textarea',
          },
        ],
        'PRICE_ON_REQUEST': [
          {
            min: 1,
            max: product.value.quantity,
            field: 'quantity',
            label: '需求数量',
            placeholder: '请输入数量',
            defaultValue: purchaseQuantity.value,
            type: 'number',
            rules: [{ required: true, message: '请输入数量' }]
          },
          {
            field: 'remark',
            label: '备注信息',
            placeholder: '请填写您的优势或者需要咨询的问题',
            type: 'textarea',
          },
        ],
        'AUCTION': [
          {
            field: 'price',
            label: '竞价',
            placeholder: '请输入竞价价格，仅可竞拍一次',
            type: 'number',
            rules: [{ required: true, message: '请输入竞价' }]
          },
          {
            min: 1,
            max: product.value.quantity,
            field: 'quantity',
            label: '竞拍数量',
            placeholder: '请输入数量',
            defaultValue: purchaseQuantity.value,
            type: 'number',
            rules: [{ required: true, message: '请输入数量' }]
          },
          {
            field: 'remark',
            label: '备注信息',
            placeholder: '请填写您的优势或者需要咨询的问题',
            type: 'textarea',
          },
        ],
      };

      // 获取对应购买方式的字段配置
      const fields = customFieldsMap[product.value.purchaseMethod];
      if (!fields) {
        message.error(`不支持的购买方式: ${product.value.purchaseMethod}`);
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
    const productId = product.value?.id;

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
      let url = `${pageConfig.value.newTodoUrl}/${productId}`;
      const response = await defHttp.post({
        url,
        data
      });

      if (response.success) {
        phoneAndEmailModal.value?.handleClose?.();

        const successConfig = {
          title: '一键敲门成功',
          message: '客服人员将在30分钟内与您联系',
          contactInfo: {
            name: '陈靖玮',
            phone: '4000118892',
            email: 'info-service@icshare.com'
          },
          buttons: [
            {
              text: '查看详情',
              type: 'primary',
              action: () => {
                pageConfig.value.viewDetailAction?.(productId);
              }
            },
            {
              text: '返回列表',
              action: () => {
                pageConfig.value.successAction?.();
              }
            }
          ],
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

  return {
    purchaseQuantity,
    isSubmitting,
    phoneAndEmailModal,
    customFields,
    actionText,
    isPurchasable,
    handlePurchase,
    handleFinish,
  };
}