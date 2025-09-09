<template>
  <div class="transaction-history-component-wrapper">
    <a-tabs v-model:activeKey="activeTabKey" class="page-tabs">
      <!-- "交易详情" tab is conditionally rendered based on context -->
      <a-tab-pane v-if="context === 'editPage'" key="transactionType" tab="交易详情"></a-tab-pane>
      <a-tab-pane key="negotiation" tab="交易历史"></a-tab-pane>
    </a-tabs>

    <div class="grid-container">
      <VxeGridWrapper
        :columns="currentGridConfig.columns"
        :data="gridData"
        :loading="loading"
        :button-config="currentGridConfig.buttons"
        @switch-change="handleSwitchChange"
        @button-click="handleButtonClick"
      >
        <!-- 数量编辑插槽 -->
        <template #quantityEdit="{ row, column }">
          <a-input-number
            v-if="isRowEditable(row)"
            v-model:value="row[column.field]"
            :min="1"
            :max="getMaxQuantity(row)"
            :placeholder="`最大值${getMaxQuantity(row)}`"
            size="small"
            style="width: 100%; height: 30px;"
            @change="(value) => handleQuantityChange(value, row, column.field)"
          />
          <span v-else>{{ row[column.field] || '-' }}</span>
        </template>

        <!-- 价格编辑插槽 -->
        <template #priceEdit="{ row, column }">
          <a-input-number
            v-if="isRowEditable(row)"
            v-model:value="row[column.field]"
            :min="0.01"
            :step="0.01"
            :precision="2"
            :placeholder="props.product.purchaseMethod === 'NEGOTIABLE' ? '仅可还价一次' : '请输入价格' "
            size="small"
            style="width: 100%; height: 30px;"
            @change="(value) => handlePriceChange(value, row, column.field)"
          />
          <span v-else>{{ formatCurrency({ cellValue: row[column.field], column }) }}</span>
        </template>

        <!-- 含税总价显示插槽 -->
        <template #publicPriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity') }}</span>
        </template>

        <!-- 不含税总价显示插槽 -->
        <template #publicPriceExcludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity', true) }}</span>
        </template>

        <!-- AUCTION含税总价显示插槽 (使用price字段) -->
        <template #auctionPriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'confirmedQuantity') }}</span>
        </template>

        <!-- AUCTION不含税总价显示插槽 (使用price字段) -->
        <template #auctionPriceExcludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'confirmedQuantity', true) }}</span>
        </template>


        <!-- JOIN系列含税总价插槽 -->
        <template #joinPriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity') }}</span>
        </template>

        <!-- JOIN系列不含税总价插槽 -->
        <template #joinPriceExcludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity', true) }}</span>
        </template>

        <!-- 成交总价(含税)插槽 - negotiation列专用 (使用priceDeal * dealQuantity) -->
        <template #negotiationDealTotalWithTax="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceDeal', 'dealQuantity') }}</span>
        </template>

        <!-- 成交总价(不含税)插槽 - negotiation列专用 (使用priceDeal * dealQuantity) -->
        <template #negotiationDealTotalWithoutTax="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceDeal', 'dealQuantity', true) }}</span>
        </template>
      </VxeGridWrapper>
    </div>

    <div class="page-footer-actions">
      <!-- The "确认出售" button is specific to the 'bidding' transaction type in the 'details' tab -->
      <a-button
        v-if="context === 'editPage' && activeTabKey === 'transactionType' && transactionType === 'PUBLICATION' && product?.purchaseMethod === 'AUCTION'"
        type="primary"
        danger
        class="confirm-button"
        :disabled="!isDeadlinePassed"
        @click="handleConfirmSell"
      >
        确认出售
      </a-button>
      <a-button class="back-button" @click="goBack">返回</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Tabs as ATabs, TabPane as ATabPane, Button as AButton, InputNumber as AInputNumber, message } from 'ant-design-vue';
import VxeGridWrapper from './VxeGridWrapper.vue';
import { Decimal } from 'decimal.js';
import { maskMiddle, selectOptions, formatDate } from '@/utils/index';
import { useTransactionGrid } from './composables/useTransactionGrid.js';

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
  // 'fullView' shows both tabs, 'editPage' shows only negotiation history
  context: {
    type: String,
    default: 'editPage', // 'fullView' | 'editPage'
    validator: (value) => ['fullView', 'editPage'].includes(value),
  },
  // For the 'details' tab, specifies which column set to use
  transactionType: {
    type: String,
    default: 'PUBLICATION', // 'PUBLICATION' | 'JOIN'
  },
  loading: { // Pass loading state from parent
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirmSell', 'switchChange', 'buttonClick', 'goBack']);

const router = useRouter();
const gridData = ref([]);

// Set initial active tab based on context
const activeTabKey = ref(props.context === 'fullView' ? 'negotiation' : 'transactionType');

const isDeadlinePassed = computed(() => {
  if (props.product?.purchaseMethod !== 'AUCTION' || !props.product?.expireDate) {
    return true;
  }
  return new Date(props.product.expireDate) < new Date();
});

/**
 * 判断行是否可编辑（统一编辑控制逻辑）
 * @param {Object} row - 行数据
 * @returns {boolean} 是否可编辑
 */
const isRowEditable = (row) => {
  if (!row) return false;

  // For AUCTION, editing is only allowed after the deadline.
  if (props.product?.purchaseMethod === 'AUCTION' && !isDeadlinePassed.value) {
    return false;
  }
  
  // 根据交易类型区分禁用状态
  if (props.transactionType === 'PUBLICATION') {
    // 出售场景的禁用状态
    return !['published', 'succeeded'].includes(row.statusCode);
  } else {
    // 购买场景的禁用状态
    return !['submit', 'succeeded'].includes(row.statusCode);
  }
};

// --- Grid Configuration ---
// All complex grid logic is now handled by the composable
const { currentGridConfig } = useTransactionGrid(props, activeTabKey, isDeadlinePassed, isRowEditable);


// --- Data Handling ---
/**
 * 根据当前标签页获取数据字段名
 * @returns {string} 数据字段名
 */
const getDataFieldName = () => {
  return activeTabKey.value === 'transactionType' ? 'submitItemList' : 'dealItemList';
};

/**
 * 更新表格数据
 * @param {Object} productData - 产品数据
 */
const updateGridData = (productData) => {
  if (!productData) {
    gridData.value = [];
    return;
  }
  
  try {
    const fieldName = getDataFieldName();
    const dataArray = productData[fieldName] || [];
    
    // 深拷贝数据以避免直接修改props
    gridData.value = JSON.parse(JSON.stringify(dataArray));
  } catch (error) {
    console.error('更新表格数据时发生错误:', error);
    gridData.value = [];
  }
};

// Watch for prop changes to update internal data state
watch(() => props.product, updateGridData, { immediate: true, deep: true });

// Watch for tab changes to reload data
watch(activeTabKey, () => {
  updateGridData(props.product);
});

// --- Template Helpers ---

/**
 * 格式化货币显示 (for #priceEdit slot)
 * @param {Object} params - 参数对象
 * @param {*} params.cellValue - 单元格值
 * @returns {string} 格式化后的货币字符串
 */
const formatCurrency = ({ cellValue, column  }) => {
  if (column?.field && column.field === 'fixedPrice') {
    return `¥${props.product.priceIncludingTax.toLocaleString('zh-CN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
  }
  if (cellValue === null || cellValue === undefined || cellValue === '') {
    return '-';
  }
  
  const numValue = Number(cellValue);
  if (isNaN(numValue)) {  
    return '-';
  }
  
  return `¥${numValue.toLocaleString('zh-CN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};


/**
 * 安全计算总价
 * @param {Object} row - 行数据
 * @returns {string} 格式化后的总价
 */
const calculateTotalPrice = (row, priceCode, quantityCode, isIncludingTax) => {
  try {
    if (!row) {
      return '-';
    }
  
    const price = Number(row[priceCode] || 0);
    const quantity = Number(row[quantityCode] || 0);
    
    if (isNaN(price) || isNaN(quantity) || price === 0 || quantity === 0) {
      return '-';
    }
    
    let total = new Decimal(price).mul(quantity);
    if (isIncludingTax) {
      total = total.div(1 + props.product.tax / 100);
    }
    return `¥${total.toFixed(2)}`;
  } catch (error) {
    console.error('计算总价时发生错误:', error, row);
    return '-';
  }
};

/**
 * 获取最大可输入数量
 * @param {Object} row - 行数据
 * @returns {number} 最大数量
 */
const getMaxQuantity = (row) => {
  if (!row) return 0;
  
  if (props.transactionType === 'PUBLICATION') {
    // 出售场景：最大数量为可出售数量
    return Number(row.quantity || 0);
  } else {
    // 购买场景：最大数量为卖方可出售数量
    return Number(row.confirmedQuantity || 0);
  }
};


// --- Event Handlers ---

/**
 * 处理数量变化
 * @param {number} value - 新数量值
 * @param {Object} row - 行数据
 * @param {string} field - 字段名
 */
const handleQuantityChange = (value, row, field) => {
  try {
    const maxQuantity = getMaxQuantity(row);
    
    // 验证数量范围
    if (value > maxQuantity) {
      message.warn(`数量不能超过${maxQuantity}`);
      row[field] = maxQuantity;
      return;
    }
    
    if (value !== '' && value < 1) {
      message.warn('数量必须大于0');
      row[field] = 1;
      return;
    }
    
    row[field] = value;
    
  } catch (error) {
    console.error('处理数量变化时发生错误:', error);
    message.error('数量更新失败');
  }
};

/**
 * 处理价格变化
 * @param {number} value - 新价格值
 * @param {Object} row - 行数据
 * @param {string} field - 字段名
 */
const handlePriceChange = (value, row, field) => {
  try {
    if (value < 0.01) {
      message.warn('价格必须大于0.01');
      row[field] = 0.01;
      return;
    }
    
    row[field] = value;
  } catch (error) {
    console.error('处理价格变化时发生错误:', error);
    message.error('价格更新失败');
  }
};

/**
 * 处理开关状态改变（单选逻辑）
 * @param {Object} params - 参数对象  
 * @param {boolean} params.checked - 开关状态
 * @param {Object} params.row - 行数据
 */
const handleSwitchChange = ({ checked, row }) => {
  if (!row) {
    console.warn('TransactionHistoryPage: row data is required for switch change');
    return;
  }
  
  try {
    row.isWinner = checked;
    emit('switchChange', { checked, row });
  } catch (error) {
    console.error('处理开关状态改变时发生错误:', error);
    message.error('操作失败，请稍后重试');
  }
};

/**
 * 验证选中的数据
 * @param {Object} selectedRow - 选中的行数据
 * @returns {boolean} 验证是否通过
 */
const validateSelectedRow = (selectedRow) => {
  if (!selectedRow || selectedRow.length == 0) {
    message.warn('请选择买方');
    return false;
  }
  let flag = true
  for (let i = 0; i < selectedRow.length; i++) {
  // 验证出售数量
    if (!selectedRow[i].confirmedQuantity || selectedRow[i].confirmedQuantity <= 0) {
      message.warn('请输入有效的卖出数量');
      flag = false
      return false;
    }
    
    // 验证数量不能超过可用数量
    if (selectedRow[i].confirmedQuantity > selectedRow[i].quantity) {
      message.warn(`卖出数量不能超过可用数量（${selectedRow[i].quantity}）`);
      flag = false
      return false;
    }
  }

  return flag;
};

/**
 * 处理按钮点击事件
 * @param {Object} params - 参数对象
 * @param {string} params.key - 按钮标识
 * @param {Object} params.row - 行数据
 */
const handleButtonClick = ({ key, row }) => {
  if (!key || !row) {
    console.warn('TransactionHistoryPage: key and row are required for button click');
    return;
  }
  
  emit('buttonClick', { key, row });
};

/**
 * 处理确认出售操作
 */
const handleConfirmSell = () => {
  try {
    // 查找选中的行
    const selectedRow = gridData.value.filter(item => item.isWinner);
    
    // 验证选中的数据
    if (!validateSelectedRow(selectedRow)) {
      return;
    }
    
    emit('confirmSell', selectedRow);
  } catch (error) {
    console.error('处理确认出售时发生错误:', error);
    message.error('操作失败，请稍后重试');
  }
};

/**
 * 处理返回操作
 */
const goBack = () => {
  try {
    emit('goBack'); // 让父组件处理导航
  } catch (error) {
    console.error('处理返回操作时发生错误:', error);
    // 如果父组件没有处理，则使用默认行为
    router.go(-1);
  }
};

// 监听上下文变化，重置活动标签
watch(() => props.context, (newContext) => {
  try {
    activeTabKey.value = newContext === 'editPage' ? 'transactionType' : 'negotiation';
  } catch (error) {
    console.error('处理上下文变化时发生错误:', error);
    // 设置为默认值
    activeTabKey.value = 'negotiation';
  }
}, { immediate: true });

// 暴露组件方法供父组件使用
defineExpose({
  /**
   * 获取当前表格数据
   * @returns {Array} 表格数据数组
   */
  getGridData: () => gridData.value,
  
  /**
   * 获取选中的行
   * @returns {Object|null} 选中的行数据
   */
  getSelectedRow: () => gridData.value.find(item => item.isWinner) || null,
  
  /**
   * 刷新表格数据
   */
  refreshData: () => updateGridData(props.product),
  
  /**
   * 清除所有选中状态
   */
  clearSelection: () => {
    gridData.value.forEach(item => {
      if (item.isWinner) {
        item.isWinner = false;
      }
    });
  }
});
</script>

<style scoped lang="less">
// Styles remain the same as the previous full page component
@import '@/assets/styles/_variables.less';

.transaction-history-component-wrapper {
  padding: @spacing-lg;
  background-color: @background-color-base;
}

.page-tabs {
  :deep(.ant-tabs-nav) { margin-bottom: @spacing-lg; }
  :deep(.ant-tabs-tab) { font-size: 16px; padding: 12px 0; }
  :deep(.ant-tabs-ink-bar) { background-color: @primary-color; height: 3px; }
  :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) { color: @primary-color; font-weight: 500; }
}

.grid-container {
  margin-bottom: @spacing-xl;
}

.page-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  .confirm-button, .back-button { min-width: 90px; }
}
</style>