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
            placeholder="请输入价格"
            size="small"
            style="width: 100%; height: 30px;"
            @change="(value) => handlePriceChange(value, row, column.field)"
          />
          <span v-else>{{ formatCurrency({ cellValue: row[column.field], column }) }}</span>
        </template>

        <!-- 含税总价显示插槽 -->
        <template #priceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity') }}</span>
        </template>

        <!-- 不含税总价显示插槽 -->
        <template #priceExcludingTaxTotal="{ row }">
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

        <!-- JOIN_FIXED_PRICE总价显示插槽 (priceIncludingTax * confirmedQuantity) -->
        <template #joinFixedPriceTotalPrice="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity') }}</span>
        </template>

        <!-- JOIN_FIXED_PRICE成交总价显示插槽 (priceIncludingTax * quantity) -->
        <template #joinFixedPriceNegotiationTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'quantity') }}</span>
        </template>

        <!-- JOIN_NEGOTIABLE成交总价显示插槽 (priceIncludingTax * confirmedQuantity) -->
        <template #joinNegotiableTotalPrice="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'confirmedQuantity') }}</span>
        </template>

        <!-- JOIN_AUCTION我的竞价总价显示插槽 (price * quantity) -->
        <template #joinAuctionMyBidTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'quantity') }}</span>
        </template>

        <!-- JOIN_AUCTION成交总价显示插槽 (price * confirmedQuantity) -->
        <template #joinAuctionDealTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'confirmedQuantity') }}</span>
        </template>

        <!-- JOIN系列含税总价插槽 -->
        <template #joinPriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'quantity') }}</span>
        </template>

        <!-- JOIN系列不含税总价插槽 -->
        <template #joinPriceExcludingTaxTotalFIXED="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'quantity', true) }}</span>
        </template>

        <!-- JOIN系列不含税总价插槽 -->
        <template #joinPriceExcludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'dealedQuantity', true) }}</span>
        </template>
        

        <!-- JOIN_NEGOTIABLE含税总价插槽 -->
        <template #joinNegotiablePriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'priceIncludingTax', 'dealedQuantity') }}</span>
        </template>

        <!-- JOIN_AUCTION含税总价插槽 (使用price字段) -->
        <template #joinAuctionPriceIncludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'confirmedQuantity') }}</span>
        </template>

        <!-- JOIN_AUCTION不含税总价插槽 (使用price字段) -->
        <template #joinAuctionPriceExcludingTaxTotal="{ row }">
          <span>{{ calculateTotalPrice(row, 'price', 'confirmedQuantity', true) }}</span>
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
import {maskMiddle, selectOptions, formatDate} from '@/utils/index';

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
const postedBy = () => {
  if (props.product.postedBy) {
    return maskMiddle(props.product.postedBy);
  }
  return '-';
}

/**
 * 格式化采购方式
 * @returns {string} 格式化后的采购方式
 */
const formatPurchaseMethod = () => {
  let txt = '';
   if (props.product.purchaseMethod) {
    selectOptions('purchase_method').forEach((item) => {
      if (item.value == props.product.purchaseMethod) {
        txt = item.label;
      }
    })
  }
  return txt;
}

const formatTax = () => {
  let txt = '';
  if (props.product.tax) {
    txt = `${props.product.tax}%`;
  }
  return txt;
}

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


// --- Grid Configurations ---
const gridConfigs = {
  PUBLICATION_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation'},  // 交易历史
      { field: 'refUserName', title: '意向买方', width: 74, columnType: 'transaction'}, 
      { field: 'createTime', title: '意向买方请购时间', width:150, columnType: 'transaction' }, // 交易详情
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod },

      { field: 'fixedPrice', title: '卖方售价', formatter: formatCurrency, width: 90, columnType: 'transaction'}, 
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'quantity', title: '意向买方请购数量', width: 98}, 
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 100, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', width: 130, formatter: ({ row }) => calculateTotalPrice(row, 'priceIncludingTax', 'quantity', true), columnType: 'transaction' },
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', formatter: ({ row }) => calculateTotalPrice(row, 'priceIncludingTax', 'quantity'), width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 160},
       { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史 
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation'},  // 交易历史
      { field: 'refUserName', title: '议价方', width: 74, columnType: 'transaction'}, 
      { field: 'createTime', title: '意向买方议价时间', width: 160, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'quantity', title: '意向买方议价数量', width: 120, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 100, columnType: 'transaction'}, 
      { field: 'price', title: '买方议价', formatter: formatCurrency, width: 100, columnType: 'transaction'}, // 交易详情和交易历史共用列 (交易历史时显示为'议价金额')
      { 
        field: 'priceIncludingTax', 
        title: '还价',
        slots: { default: 'priceEdit' },
         width: 120,
        columnType: 'transaction'
      },
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit'},
         width: 100,
        columnType: 'transaction' 
      },
      { title: '操作', slots: { default: 'buttons' }, width: 300, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 100, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'priceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'priceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'deal', label: '不还价直接成交', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
          { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '询价方', width: 74}, 
      { field: 'createTime', title: '意向买方询价时间', width: 150,columnType: 'transaction'  }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity,columnType: 'transaction' }, 
      { field: 'quantity', title: '意向买方请购数量', width: 98,columnType: 'transaction'}, 
      // { field: 'fixedPrice', title: '卖方初始价格', formatter: () => '***', width: 100 }, 
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { 
        field: 'priceIncludingTax', 
        title: '报价',
        slots: { default: 'priceEdit' },
         width: 120,
        columnType: 'transaction'
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '标价', formatter: () => '***', width: 100, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'priceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'priceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, 
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '竞拍方', width: 74}, 
      { field: 'expireDate', title: '竞拍截止时间', width: 98, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'createTime', title: '竞拍方竞拍时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'quantity', title: '竞拍方竞拍数量', width: 98, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '起拍价', formatter: formatCurrency, width: 100, columnType: 'transaction' }, 
      { field: 'price', title: '竞拍方竞拍价', formatter: formatCurrency, width: 100, columnType: 'transaction' }, 
      { field: 'isWinner', title: '选定买方', slots: { default: 'switch' }, width: 120, columnType: 'transaction' }, 
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 100, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'auctionPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'auctionPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [],
  },
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
       { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'createTime', title: '意向买方请购时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'fixedPrice', title: '卖方售价', formatter: formatCurrency, width: 90, columnType: 'transaction' }, 
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120, columnType: 'transaction'}, 
      { 
        field: 'quantity', 
        title: '请购数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotalFIXED' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'createTime', title: '议价时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'quantity', title: '议价数量', width: 98, columnType: 'transaction'}, 
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120, columnType: 'transaction' },
      { field: 'fixedPrice', title: '卖方标价', formatter: formatCurrency, width: 100, columnType: 'transaction' },
      { field: 'price', title: '议价', formatter: formatCurrency, width: 100, columnType: 'transaction'  }, // 交易详情和交易历史共用列 (交易历史时显示为'议价金额')
      { field: 'priceIncludingTax', title: '卖方还价', formatter: formatCurrency, width: 90, columnType: 'transaction'}, 
      { 
        field: 'dealedQuantity', 
        title: '请购数量',
        slots: { default: 'quantityEdit'},
         width: 100,
        columnType: 'transaction' 
      },
      { title: '操作', slots: { default: 'buttons' }, width: 210, columnType: 'transaction' }, 
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotalFIXED' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinNegotiablePriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'createTime', title: '询价时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'priceIncludingTax', title: '卖方报价', formatter: formatCurrency, width: 100 }, 
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity }, 
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120}, 
      { 
        field: 'quantity', 
        title: '请购数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'dealQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation' }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', formatter: () => '***', width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', formatter: () => '***', width: 130, columnType: 'negotiation' }, // 成交总价(不含税) - 隐藏实际价格
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', width: 130, formatter: () => '***', columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', formatter: () => '***', width: 124, columnType: 'negotiation' }, // 成交总价(含税) - 隐藏实际价格
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, 
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 250}, 
         { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'expireDate', title: '竞拍截止时间', width: 98, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'createTime', title: '参与竞拍时间', width:150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'purchaseMethod', title: '价格类型', width: 90, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'confirmedQuantity', title: '竞拍数量', width: 98, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '起拍价', formatter: formatCurrency, width: 100, columnType: 'transaction' }, 
      { field: 'price', title: '竞拍价', formatter: formatCurrency, width: 100, columnType: 'transaction' }, 
      // { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
      //   if (!row.statusCode) return ''
      //   return row.statusCode == 'success' ? '交易达成' : '交易未达成'
      // }, columnType: 'negotiation' }, 
      { 
        field: 'dealedQuantity', 
        title: '请购数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 100, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinAuctionPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'priceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinAuctionPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '买方请购说明', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
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
 * 为交易历史调整列标题
 * @param {Array} columns - 列配置数组
 * @returns {Array} 调整后的列配置数组
 */
const adjustNegotiationColumnTitles = (columns) => {
  return columns.map(column => {
    // 深拷贝列配置以避免修改原始配置
    const newColumn = { ...column };
    
    // 根据字段名调整交易历史的列标题
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
    // 交易历史：过滤并调整列配置
    const filteredColumns = filterColumnsByType(baseConfig.columns, 'negotiation');
    // const adjustedColumns = adjustNegotiationColumnTitles(filteredColumns);
    
    return {
      columns: filteredColumns,
      // columns: adjustedColumns,
      buttons: [] // 交易历史不显示操作按钮
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