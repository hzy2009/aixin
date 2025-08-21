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
      />
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Tabs as ATabs, TabPane as ATabPane, Button as AButton, message, Modal } from 'ant-design-vue';
import VxeGridWrapper from './VxeGridWrapper.vue'; // Adjust path if necessary
import { Decimal } from 'decimal.js';
import defHttp from '@/utils/http/axios'

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
const gridData = ref([{}]);

// Set initial active tab based on context
const activeTabKey = ref(props.context === 'fullView' ? 'negotiation' : 'transactionType');

// Watch for prop changes to update internal data state
// watch(() => props.product, (newData) => {
//   const groupCode = activeTabKey.value === 'transactionType' ? 'submitItemList' : 'dealItemList';
//   gridData.value = JSON.parse(JSON.stringify(newData[groupCode] || []));
// }, { immediate: true, deep: true });

// --- Helper for formatting currency ---
const formatCurrency = ({ cellValue }) => {
  if (cellValue === null || cellValue === undefined) return '';
  return `¥${Number(cellValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// --- Grid Configurations ---
const gridConfigs = {
  PUBLICATION_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '买方' },
      { field: 'price', title: '固定价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => {
        if (row.price && row.quantity) {
          return Decimal.mul(row.price, row.quantity)
        } else {
          return '-'
        }
      } },
      { field: 'approveTime', title: '购买时间' },
      { field: 'sellQuantity', title: '出售数量', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 180   },
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true },
      { key: 'cancelSale', label: '取消出售', type: 'default' },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'buyerId', title: '买方' },
      { field: 'negotiatedPrice', title: '买方议价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'negotiationTime', title: '议价时间' },
      { field: 'dealQuantity', title: '交易数量', editRender: { name: 'VxeNumberInput' } },
      { field: 'sellerCounterOffer', title: '卖方还价', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 320 },
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'primary', danger: true },
      { key: 'deal', label: '不还价直接成交', type: 'default', getDisabledState: (row) => row.status == 'dealt' },
      { key: 'cancelSale', label: '取消出售', type: 'default' },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '买方' },
      { field: 'price', title: '固定价', formatter: () => '*,***,***,**' },
      { field: 'quantity', title: '购买数量' },
      { field: 'totalPrice', title: '总价', formatter: () => '*,***,***,**' },
      { field: 'approveTime', title: '购买时间' },
      { field: 'sellQuantity', title: '出售数量', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 180 },
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true },
      { key: 'cancelSale', label: '取消出售', type: 'default' },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'buyerId', title: '买方' },
      { field: 'offerPrice', title: '买方出价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'offerTime', title: '出价时间' },
      { field: 'deadline', title: '竞拍截止时间' },
      { field: 'isSelected', title: '选定买方', slots: { default: 'switch' }, width: 120 },
      { field: 'sellQuantity', title: '卖出数量', editRender: { name: 'VxeNumberInput' } },
    ],
    buttons: [],
  },
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '固定价', formatter: formatCurrency },
      { field: 'quantity', title: '可出售数量' },
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => {
        if (row.price && row.quantity) {
          return Decimal.mul(row.price, row.quantity)
        } else {
          return '- '
        }
      } },
      { field: 'approveTime', title: '购买时间' },
      { field: 'sellQuantity', title: '购买数量', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true },
      { key: 'cancelBuy', label: '取消交易', type: 'default' },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'price', title: '固定价', formatter: formatCurrency },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '我的议价', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'approveTime', title: '议价时间' },
      { field: 'priceExcludingTax', title: '卖方议价', formatter: formatCurrency },
      { field: 'sellQuantity', title: '可卖数量', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true },
      { key: 'cancelBuy', label: '取消交易', type: 'default' },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '固定价', formatter: () => '*,***,***,**'},
      { field: 'quantity', title: '可卖数量'},
      { field: 'totalPrice', title: '总价', formatter: () => '*,***,***,**' },
      { field: 'approveTime', title: '购买时间' },
      { field: 'sellQuantity', title: '购买数量', editRender: { name: 'VxeNumberInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true },
      { key: 'cancelBuy', label: '取消交易', type: 'default' },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '我的竞价', formatter: formatCurrency},
      { field: 'quantity', title: '购买数量'},
      { field: 'totalPrice', title: '我的竞价总价', formatter: ({ row }) => Decimal.mul(row.price, row.quantity) },
      { field: 'approveTime', title: '竞价时间' },
      { field: 'expireDate', title: '竞拍截止时间' },
      { field: 'expireDate', title: '竞拍状态' },
      { title: '交易', slots: { default: 'buttons' }, width: 220 },
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'primary', danger: true },
    ],
  },
  negotiation: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'refUserName', title: '卖方' },
      { field: 'price', title: '我的竞价', formatter: formatCurrency},
      { field: 'quantity', title: '购买数量'},
      { field: 'totalPrice', title: '我的竞价总价', formatter: ({ row }) => Decimal.mul(row.price, row.quantity) },
      { field: 'approveTime', title: '竞价时间' },
      { field: 'expireDate', title: '竞拍截止时间' },
      { field: 'expireDate', title: '竞拍状态' },
      { title: '交易', slots: { default: 'buttons' }, width: 220 },
    ],
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
// These handlers simply forward the events to the parent component
const handleSwitchChange = ({ checked, row }) => {
  // if (checked) {
  //   gridData.value.forEach(item => {
  //     if (item !== row) item.isSelected = false;
  //   });
  // }
  // emit('switchChange', { checked, row });
};

const handleButtonClick = ({ key, row }) => {
  emit('buttonClick', { key, row });
};

const handleConfirmSell = () => {
  const selectedRow = gridData.value.find(item => item.isSelected);
  if (!selectedRow) {
    message.warn('请先选定一个买方');
    return;
  }
  if (!selectedRow.sellQuantity || Number(selectedRow.sellQuantity) <= 0) {
    message.warn('请输入有效的卖出数量');
    return;
  }
  emit('confirmSell', selectedRow); // Emit the selected row to the parent
};

const goBack = () => {
  // router.go(-1);
  emit('goBack'); // Let parent handle navigation
};

// When context prop changes, reset the active tab
watch(() => props.context, (newContext) => {
    activeTabKey.value = newContext === 'editPage' ? 'negotiation' : 'details';
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