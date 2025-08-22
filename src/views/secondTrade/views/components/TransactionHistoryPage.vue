<template>
  <div class="transaction-history-component-wrapper">
    <a-tabs v-model:activeKey="activeTabKey" class="page-tabs">
      <!-- "交易详情" tab is conditionally rendered based on context -->
      <a-tab-pane v-if="context === 'editPage'" key="transactionType" tab="交易详情"></a-tab-pane>
      <a-tab-pane key="negotiation" tab="议价历史"></a-tab-pane>
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
            :placeholder="`最大可输入${getMaxQuantity(row)}`"
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
            placeholder="请输入价格"
            size="small"
            style="width: 100%; height: 30px;"
            @change="(value) => row[column.field] = value"
          />
          <span v-else>{{ formatCurrency({ cellValue: row[column.field], column }) }}</span>
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

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
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

/**
 * 格式化货币显示
 * @param {Object} params - 参数对象
 * @param {*} params.cellValue - 单元格值
 * @returns {string} 格式化后的货币字符串
 */
const formatCurrency = ({ cellValue, column  }) => {
  if (column?.field && column.field === 'fixedPrice') {
    return `¥${props.product.priceExcludingTax.toLocaleString('zh-CN', { 
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
const calculateTotalPrice = (row) => {
  try {
    if (!row) {
      return '-';
    }
    
    // 根据不同场景使用不同的价格和数量字段
    const price = Number(row.priceExcludingTax || row.price || 0);
    const quantity = Number(row.quantity || row.confirmedQuantity || 0);
    
    if (isNaN(price) || isNaN(quantity) || price === 0 || quantity === 0) {
      return '-';
    }
    
    const total = new Decimal(price).mul(quantity);
    return `¥${total.toFixed(2)}`;
  } catch (error) {
    console.error('计算总价时发生错误:', error, row);
    return '-';
  }
};

/**
 * 判断行是否可编辑（统一编辑控制逻辑）
 * @param {Object} row - 行数据
 * @returns {boolean} 是否可编辑
 */
const isRowEditable = (row) => {
  if (!row) return false;
  
  // 根据交易类型区分禁用状态
  if (props.transactionType === 'PUBLICATION') {
    // 出售场景的禁用状态
    return !['published', 'succeeded'].includes(row.statusCode);
  } else {
    // 购买场景的禁用状态
    return !['submit', 'succeeded'].includes(row.statusCode);
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
    
    if (value < 1) {
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

// --- Grid Configurations ---
const gridConfigs = {
  PUBLICATION_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '买方' },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row) },
      { field: 'createTime', title: '购买时间', width: 180 },
      { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180 },
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'refUserName', title: '买方' },
      { field: 'price', title: '买方议价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'negotiationTime', title: '议价时间' },
      { 
        field: 'confirmedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit'},
         width: 120
      },
      { 
        field: 'priceExcludingTax', 
        title: '卖方还价',
        slots: { default: 'priceEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 300 },
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'deal', label: '不还价直接成交', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '买方' },
      { field: 'priceExcludingTax', title: '固定价', formatter: () => '*,***,***,**' },
      { field: 'quantity', title: '购买数量' },
      { field: 'totalPrice', title: '总价', formatter: () => '*,***,***,**' },
      { field: 'approveTime', title: '购买时间' },
      { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180 },
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '买方' },
      { field: 'price', title: '买方出价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'offerTime', title: '出价时间' },
      { field: 'deadline', title: '竞拍截止时间' },
      { field: 'isSelected', title: '选定买方', slots: { default: 'switch' }, width: 120 },
      { 
        field: 'confirmedQuantity', 
        title: '卖出数量',
        slots: { default: 'quantityEdit' }
      },
    ],
    buttons: [],
  },
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'confirmedQuantity', title: '可出售数量' },
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row) },
      { field: 'approveTime', title: '购买时间' },
      { 
        field: 'quantity', 
        title: '购买数量',
        slots: { default: 'quantityEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '我的议价', formatter: formatCurrency },
      { field: 'confirmedQuantity', title: '购买数量' },
      { field: 'approveTime', title: '议价时间' },
      { field: 'priceExcludingTax', title: '卖方议价', formatter: formatCurrency },
      { 
        field: 'quantity', 
        title: '可卖数量',
        slots: { default: 'quantityEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'priceExcludingTax', title: '固定价', formatter: () => '*,***,***,**'},
      { field: 'confirmedQuantity', title: '可卖数量'},
      { field: 'totalPrice', title: '总价', formatter: () => '*,***,***,**' },
      { field: 'approveTime', title: '购买时间' },
      { 
        field: 'quantity', 
        title: '购买数量',
        slots: { default: 'quantityEdit' }
      },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '我的竞价', formatter: formatCurrency},
      { field: 'quantity', title: '购买数量'},
      { field: 'totalPrice', title: '我的竞价总价', formatter: ({ row }) => calculateTotalPrice(row) },
      { field: 'approveTime', title: '竞价时间' },
      { field: 'expireDate', title: '竞拍截止时间' },
      { field: 'bidStatus', title: '竞拍状态' },
      { title: '交易', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  negotiation: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '对方' },
      { field: 'price', title: '议价金额', formatter: formatCurrency},
      { field: 'quantity', title: '议价数量'},
      { field: 'totalPrice', title: '议价总价', formatter: ({ row }) => calculateTotalPrice(row) },
      { field: 'negotiationTime', title: '议价时间' },
      { field: 'status', title: '议价状态' },
    ]
  }
};

const currentGridConfig = computed(() => {
  if (activeTabKey.value === 'negotiation') {
    return gridConfigs.negotiation;
  }
  if (activeTabKey.value === 'transactionType') {
    // Select the correct 'details' config based on the transactionType prop
    const columnType = props.product?.purchaseMethod || 'FIXED_PRICE';
    return gridConfigs[`${props.transactionType}_${columnType}`] || { columns: [], buttons: [] };
  }
  return { columns: [], buttons: [] }; // Fallback
});

// --- Event Handlers ---
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
    // 实现单选逻辑：如果选中，则取消其他项的选中状态
    if (checked) {
      gridData.value.forEach(item => {
        if (item !== row && item.isSelected) {
          item.isSelected = false;
        }
      });
    }
    
    // 更新当前行的选中状态
    row.isSelected = checked;
    
    // 向父组件发送事件
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
  if (!selectedRow) {
    message.warn('请先选定一个买方');
    return false;
  }
  
  // 验证出售数量
  const confirmedQuantity = Number(selectedRow.confirmedQuantity);
  if (!selectedRow.confirmedQuantity || confirmedQuantity <= 0) {
    message.warn('请输入有效的卖出数量');
    return false;
  }
  
  // 验证数量不能超过可用数量
  const availableQuantity = Number(selectedRow.quantity);
  if (confirmedQuantity > availableQuantity) {
    message.warn(`卖出数量不能超过可用数量（${availableQuantity}）`);
    return false;
  }
  
  return true;
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
    const selectedRow = gridData.value.find(item => item.isSelected);
    
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
  getSelectedRow: () => gridData.value.find(item => item.isSelected) || null,
  
  /**
   * 刷新表格数据
   */
  refreshData: () => updateGridData(props.product),
  
  /**
   * 清除所有选中状态
   */
  clearSelection: () => {
    gridData.value.forEach(item => {
      if (item.isSelected) {
        item.isSelected = false;
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