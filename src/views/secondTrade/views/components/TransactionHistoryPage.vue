    <template>
  <div class="transaction-history-page">
    <a-tabs v-model:activeKey="activeTabKey" class="page-tabs">
      <a-tab-pane key="bidding" tab="交易详情"></a-tab-pane>
      <a-tab-pane key="negotiation" tab="议价历史"></a-tab-pane>
    </a-tabs>

    <div class="grid-container">
      <VxeGridWrapper
        :columns="currentGridConfig.columns"
        :data="gridData"
        :loading="isLoading"
        :button-config="currentGridConfig.buttons"
        @switch-change="handleSwitchChange"
        @button-click="handleButtonClick"
      />
    </div>

    <div class="page-footer-actions">
      <a-button
        v-if="currentGridConfig.showConfirmButton"
        type="primary"
        danger
        class="confirm-button"
        @click="handleConfirm"
      >
        确认出售
      </a-button>
      <a-button class="back-button" @click="goBack">返回</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Tabs as ATabs, TabPane as ATabPane, Button as AButton, message, Modal } from 'ant-design-vue';
import VxeGridWrapper from './VxeGridWrapper.vue'; // Adjust path
// import apiClient from '@/api'; // Your Axios instance

const router = useRouter();
const activeTabKey = ref('bidding'); // Default tab

const gridData = ref([]);
const isLoading = ref(false);

// --- Helper for formatting currency ---
const formatCurrency = ({ cellValue }) => {
  if (cellValue === null || cellValue === undefined) return '';
  return `¥${Number(cellValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// --- Grid Configurations for each tab ---
const gridConfigs = {
  bidding: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'buyerId', title: '买方' },
      { field: 'offerPrice', title: '买方出价(不含税)', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'offerTime', title: '出价时间' },
      { field: 'deadline', title: '竞拍截止时间' },
      { field: 'isSelected', title: '选定买方', slots: { default: 'switch' }, width: 140 },
      { field: 'sellQuantity', title: '卖出数量', editRender: { name: 'VxeInput' } },
    ],
    showConfirmButton: true,
    buttons: [], // No buttons in cells for this view
  },
  negotiation: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency },
      { field: 'buyerId', title: '买方' },
      { field: 'negotiatedPrice', title: '买方议价(不含税)', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'negotiationTime', title: '议价时间' },
      { field: 'dealQuantity', title: '交易数量', editRender: { name: 'VxeInput' } },
      { field: 'sellerCounterOffer', title: '卖方还价', editRender: { name: 'VxeInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 260 },
    ],
    showConfirmButton: false,
    buttons: [
      { key: 'notify', label: '价格通知买家', type: 'primary', danger: true },
      { key: 'deal', label: '不还价直接成交', type: 'default', getDisabledState: (row) => row.status === 'dealt' /* Example disabled logic */ },
    ],
  },
  fixedPrice: {
    columns: [
      { type: 'seq', title: '序号', width: 60 },
      { field: 'buyerId', title: '买方' },
      { field: 'fixedPrice', title: '固定价(不含税)', formatter: formatCurrency },
      { field: 'quantity', title: '购买数量' },
      { field: 'totalPrice', title: '总价', formatter: formatCurrency },
      { field: 'purchaseTime', title: '购买时间' },
      { field: 'sellQuantity', title: '出售数量', editRender: { name: 'VxeInput' } },
      { title: '操作', slots: { default: 'buttons' }, width: 220 },
    ],
    showConfirmButton: false, // No single confirm button at bottom
    buttons: [
       { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true },
       { key: 'cancelSale', label: '取消出售', type: 'default' },
    ],
  },
};

const currentGridConfig = computed(() => gridConfigs[activeTabKey.value] || { columns: [], buttons: [] });

// --- Data Fetching ---
async function fetchDataForTab(tabKey) {
  isLoading.value = true;
  try {
    // TODO: Replace with your actual API calls
    // const response = await apiClient.get(`/api/transactions/${tabKey}/list`, { params: { ... } });
    // gridData.value = response.data.records;

    // --- Mock Data ---
    console.log(`[MOCK API] Fetching data for tab: ${tabKey}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    let mockData = [];
    const baseData = [
      { buyerId: 'C1067658', quantity: 3, offerPrice: 3450000, offerTime: '2025-08-29 16:48:23', deadline: '2025-09-03 16:48:23', isSelected: false, sellQuantity: null, fixedPrice: 3500000, negotiatedPrice: 3450000, negotiationTime: '2025-08-29 16:48:23', dealQuantity: null, sellerCounterOffer: null, totalPrice: 11400, purchaseTime: '2025-08-29 16:48:23', status: 'pending' },
      { buyerId: 'C1004398', quantity: 1, offerPrice: 3480000, offerTime: '2025-08-29 16:48:23', deadline: '2025-09-03 16:48:23', isSelected: false, sellQuantity: null, fixedPrice: 3500000, negotiatedPrice: 3480000, negotiationTime: '2025-08-29 16:48:23', dealQuantity: null, sellerCounterOffer: null, totalPrice: 3800, purchaseTime: '2025-08-29 16:48:23', status: 'pending' },
      { buyerId: 'C1008646', quantity: 2, offerPrice: 3486000, offerTime: '2025-08-29 16:48:23', deadline: '2025-09-03 16:48:23', isSelected: false, sellQuantity: null, fixedPrice: 3500000, negotiatedPrice: 3486000, negotiationTime: '2025-08-29 16:48:23', dealQuantity: null, sellerCounterOffer: null, totalPrice: 7600, purchaseTime: '2025-08-29 16:48:23', status: 'dealt' },
      { buyerId: 'C1006578', quantity: 3, offerPrice: 3470000, offerTime: '2025-08-29 16:48:23', deadline: '22025-09-03 16:48:23', isSelected: false, sellQuantity: null, fixedPrice: 3500000, negotiatedPrice: 3470000, negotiationTime: '2025-08-29 16:48:23', dealQuantity: null, sellerCounterOffer: null, totalPrice: 11400, purchaseTime: '2025-08-29 16:48:23', status: 'pending' },
    ];
    // Clone data to avoid reactivity issues across tabs in mock
    mockData = baseData.map(item => ({ ...item, _id: `${tabKey}-${item.buyerId}` }));
    gridData.value = mockData;
    // --- End Mock Data ---
  } catch (error) {
    console.error("Failed to fetch grid data:", error);
    message.error("数据加载失败");
    gridData.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchDataForTab(activeTabKey.value);
});

watch(activeTabKey, (newTabKey) => {
  fetchDataForTab(newTabKey);
});

// --- Event Handlers ---
const handleSwitchChange = ({ checked, row }) => {
  console.log('Switch changed:', checked, row);
  // Logic for selecting a buyer, e.g., unselect others
  if (checked) {
    gridData.value.forEach(item => {
      if (item !== row) {
        item.isSelected = false;
      }
    });
  }
  // TODO: Maybe an API call is needed here
};

const handleButtonClick = ({ key, row }) => {
  console.log('Button clicked:', key, row);
  Modal.info({
      title: '操作确认',
      content: `您点击了 [${key}] 按钮，针对买方 [${row.buyerId}]。`,
  });
  // TODO: Implement logic for each button key (notify, deal, confirmSale, cancelSale)
};

const handleConfirm = () => {
  const selectedRow = gridData.value.find(item => item.isSelected);
  if (!selectedRow) {
    message.warn('请先选定一个买方');
    return;
  }
  if (!selectedRow.sellQuantity || selectedRow.sellQuantity <= 0) {
    message.warn('请输入有效的卖出数量');
    return;
  }
  console.log('Confirming sale:', selectedRow);
  Modal.confirm({
      title: '确认出售',
      content: `您确定要向买方 [${selectedRow.buyerId}] 出售 [${selectedRow.sellQuantity}] 件商品吗？`,
      onOk() {
          // TODO: Call API to confirm sale
          message.success('出售确认操作已提交');
      }
  });
};

const goBack = () => {
  router.go(-1);
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.transaction-history-page {
  padding: @spacing-lg;
  background-color: @background-color-base;
  // border-radius, box-shadow etc. can be added if this component isn't inside another container
}

.page-tabs {
  // Custom styling for AntD tabs to match image
  :deep(.ant-tabs-nav) {
    margin-bottom: @spacing-lg;
  }
  :deep(.ant-tabs-tab) {
    font-size: 16px;
    padding: 12px 0; // Only bottom padding is effective due to ink bar
  }
  :deep(.ant-tabs-ink-bar) {
    background-color: @primary-color;
    height: 3px;
  }
   :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: @primary-color;
    font-weight: 500;
  }
}

.grid-container {
  margin-bottom: @spacing-xl;
}

.page-footer-actions {
  display: flex;
  justify-content: flex-end; // Align buttons to the right
  gap: 12px;

  .confirm-button {
    min-width: 90px;
    // background-color: @primary-color; // `danger` prop might handle this
  }
  .back-button {
    min-width: 90px;
  }
}
</style>