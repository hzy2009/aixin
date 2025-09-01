<template>
  <div class="transaction-history-component-wrapper">
    <a-tabs v-model:activeKey="activeTabKey" class="page-tabs">
      <!-- "交易详情" tab is conditionally rendered based on context -->
      <a-tab-pane v-if="context === 'editPage'" key="transactionType" tab="交易详情"></a-tab-pane>
      <a-tab-pane key="negotiation" :tab="props.product?.purchaseMethod == 'NEGOTIABLE' ? '议价历史' : '交易历史'"></a-tab-pane>
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
import {maskMiddle} from '@/utils/index';

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
const postedBy = () => {
  if (props.product.postedBy) {
    return maskMiddle(props.product.postedBy);
  }
}

/**
 * 安全计算总价
 * @param {Object} row - 行数据
 * @returns {string} 格式化后的总价
 */
const calculateTotalPrice = (row, priceCode, quantityCode) => {
  try {
    if (!row) {
      return '-';
    }
    
    // 根据不同场景使用不同的价格和数量字段
    // const price = Number(row.price || row.priceExcludingTax || 0);
    // const quantity = Number(row.quantity || row.confirmedQuantity || 0);
    const price = Number(row[priceCode] || 0);
    const quantity = Number(row[quantityCode] || 0);
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
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 100}, // 交易详情列
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 120 }, // 交易详情列
      { field: 'quantity', title: '购买数量', width: 80}, // 交易详情列
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'quantity'), width: 120 }, // 交易详情列
      { field: 'createTime', title: '购买时间', width: 160, columnType: 'both' }, // 交易详情和议价历史共用列
     
      { field: 'confirmedQuantity', title: '成交数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'priceExcludingTaxTotal', title: '成交总价', columnType: 'negotiation', width: 80, formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity') }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, // 议价历史列
      { field: 'remark', title: '备注' }, // 议价历史列
       { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 100 }, 
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 120 }, 
      { field: 'price', title: '买方议价', formatter: formatCurrency, width: 120  }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80  }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '议价时间'}, 
      { 
        field: 'confirmedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit'},
         width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { 
        field: 'priceExcludingTax', 
        title: '我的还价',
        slots: { default: 'priceEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { 
        field: 'priceExcludingTax', 
        title: '我的还价',
        columnType: 'negotiation' // 交易详情列
      },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation' }, 
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), width: 120, columnType: 'negotiation' }, // 议价历史列
      { title: '操作', slots: { default: 'buttons' }, width: 300, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'deal', label: '不还价直接成交', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 120 },
      { field: 'priceExcludingTax', title: '卖方售价', formatter: () => '*,***,**', width: 80 }, // 交易详情列
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '购买时间', width: 160 }, // 交易详情列
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation' }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' },
        width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', columnType: 'both', width: 120 }, // 交易详情和议价历史共用列 (议价历史时显示为'对方')
      { field: 'price', title: '买方出价', formatter: formatCurrency, columnType: 'both', width: 80 }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', columnType: 'both', width: 80 }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '出价时间', width: 160 }, // 交易详情列
      { field: 'expireDate', title: '竞拍截止时间', width: 160 }, // 交易详情列
      { field: 'priceExcludingTax', title: '成交价格', columnType: 'negotiation', width: 100 }, 
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation', width: 100 },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'isWinner', title: '选定买方', slots: { default: 'switch' }, width: 120, columnType: 'transaction' }, // 交易详情列
      { 
        field: 'confirmedQuantity', 
        title: '卖出数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
    ],
    buttons: [],
  },
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 100}, // 交易详情列
      { field: 'confirmedQuantity', title: '可出售数量', width: 100 }, // 交易详情列
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), columnType: 'transaction' }, // 交易详情列
      { field: 'createTime', title: '购买时间' }, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'quantity'), columnType: 'negotiation' }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'quantity', 
        title: '购买数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 220, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'price', title: '我的议价', formatter: formatCurrency, width: 90, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '议价时间', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'priceExcludingTax', title: '卖方议价', formatter: formatCurrency, width: 90}, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), columnType: 'negotiation' }, // 议价历史列
      { field: 'confirmedQuantity', title: '成交数量', width: 72 }, // 交易详情列
      { 
        field: 'dealedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, columnType: 'transaction' }, // 交易详情列
      { field: 'remark', title: '备注', width: 90, columnType: 'both' }, // 交易详情和议价历史共用列
      { title: '操作', slots: { default: 'buttons' }, width: 210, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'priceExcludingTax', title: '固定价', formatter: () => '*,***,**', width: 80 }, // 交易详情列
      { field: 'confirmedQuantity', title: '可出售数量', width: 90 }, // 交易详情列
      { field: 'totalPrice', title: '总价', formatter: () => '*,***,**', width: 80 }, // 交易详情列
      { field: 'createTime', title: '购买时间', width: 160}, // 交易详情列
      { field: 'quantity', title: '成交数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, // 议价历史列
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'quantity', 
        title: '购买数量',
        slots: { default: 'quantityEdit' },
        width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'price', title: '我的竞价', formatter: formatCurrency, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'totalPrice', title: '我的竞价总价', formatter: ({ row }) => calculateTotalPrice(row, 'price',  'quantity'), columnType: 'transaction' }, // 交易详情列
      { field: 'createTime', title: '竞价时间' }, // 交易详情列
      { field: 'expireDate', title: '竞拍截止时间' }, // 交易详情列
      { field: 'bidStatus', title: '竞拍状态', width: 80, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '竞拍成功' : '竞拍失败'
      }, columnType: 'transaction' }, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'price',  'confirmedQuantity'), columnType: 'negotiation' }, // 交易详情列
      { field: 'confirmedQuantity', title: '成交数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'confirmedQuantity', title: '可卖数量', columnType: 'transaction' }, // 交易详情列
       { 
        field: 'dealedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '交易', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  }
};

/**
 * 根据列类型过滤列配置
 * @param {Array} columns - 原始列配置数组
 * @param {string} filterType - 过滤类型 ('transaction' | 'negotiation')
 * @returns {Array} 过滤后的列配置数组
 */
const filterColumnsByType = (columns, filterType) => {
  return columns.filter(column => {
    // 序号列始终显示
    if (column.type === 'seq') return true;
    
    // 根据columnType字段过滤
    const columnType = column.columnType || 'both';
    return columnType === 'both' || columnType === filterType;
  });
};

/**
 * 为议价历史调整列标题
 * @param {Array} columns - 列配置数组
 * @returns {Array} 调整后的列配置数组
 */
const adjustNegotiationColumnTitles = (columns) => {
  return columns.map(column => {
    // 深拷贝列配置以避免修改原始配置
    const newColumn = { ...column };
    
    // 根据字段名调整议价历史的列标题
    switch (column.field) {
      case 'price':
        if (column.title !== '我的议价' && column.title !== '我的竞价') {
          newColumn.title = '议价金额';
        }
        break;
      case 'quantity':
        if (column.title !== '我的竞价') {
          newColumn.title = '议价数量';
        }
        break;
      case 'createTime':
      case 'negotiationTime':
        newColumn.title = '议价时间';
        break;
    }
    
    return newColumn;
  });
};

const currentGridConfig = computed(() => {
  // 获取基础配置
  const columnType = props.product?.purchaseMethod || 'FIXED_PRICE';
  const baseConfig = gridConfigs[`${props.transactionType}_${columnType}`] || { columns: [], buttons: [] };
  
  if (activeTabKey.value === 'negotiation') {
    // 议价历史：过滤并调整列配置
    const filteredColumns = filterColumnsByType(baseConfig.columns, 'negotiation');
    // const adjustedColumns = adjustNegotiationColumnTitles(filteredColumns);
    
    return {
      columns: filteredColumns,
      // columns: adjustedColumns,
      buttons: [] // 议价历史不显示操作按钮
    };
  }
  
  if (activeTabKey.value === 'transactionType') {
    // 交易详情：过滤列配置
    const filteredColumns = filterColumnsByType(baseConfig.columns, 'transaction');
    
    return {
      columns: filteredColumns,
      buttons: baseConfig.buttons || []
    };
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
    // if (checked) {
    //   gridData.value.forEach(item => {
    //     if (item !== row && item.isWinner) {
    //       item.isWinner = false;
    //     }
    //   });
    // }
    
    // 更新当前行的选中状态
    row.isWinner = checked;
    
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