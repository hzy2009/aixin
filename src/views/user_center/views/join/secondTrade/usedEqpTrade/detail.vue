<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <TransactionHistoryPage :transactionType="'JOIN'" :product="productData"  @buttonClick="handleButtonClick" @goBack="goBack"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailTemplate from '@/views/secondTrade/views/components/DetailTemplate.vue';
import TransactionHistoryPage from '@/views/secondTrade/views/components/TransactionHistoryPage.vue';
import { message  } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'
import {USEDEQPTRADEDETAIL} from '@/utils/const.jsx';

const route = useRoute();
const router = useRouter();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const productData = ref({});
// --- Page Configuration (定义了如何从 `productData` 映射到UI) ---
const productPageConfig = ref({
  showPostedBy: true,
  pageState: 'detail',
  ...USEDEQPTRADEDETAIL,
});
const isLoading = ref(false);
const internalDemandId = ref(props.IdProp || route.params.id);

/**
 * 获取产品详情
 */
async function fetchReportDetail() {
  const id = internalDemandId.value;
  if (!id) {
    console.error('缺少产品ID');
    return;
  }
  
  isLoading.value = true;
  try {
    const response = await defHttp.get({ 
      url: '/apm/apmDeviceSecondhand/queryById', 
      params: { id } 
    });
    
    if (response.success) {
      productData.value = response.result;
    } else {
      message.error(response.message || '获取详情失败');
      productData.value = null;
    }
  } catch (err) {
    console.error("获取详情失败:", err);
    productData.value = null;
  } finally {
    isLoading.value = false;
  }
}
/**
 * 处理操作请求
 * @param {Object} params - 参数对象
 * @param {string} params.url - API地址
 * @param {Object} params.data - 请求数据
 */
const handleAction = async ({ url, data }) => {
  const id = internalDemandId.value;
  if (!id) {
    message.error('缺少产品ID');
    return;
  }

  isLoading.value = true;
  try {
    const response = await defHttp.post({ 
      url: `${url}/${id}`, 
      data: Array.isArray(data) ? data : [data]
    });
    
    if (response.success) {
      message.success(response.message || '操作成功');
      await fetchReportDetail(); // 刷新数据
    } else {
      message.error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    isLoading.value = false;
  }
};
const confirmBuy = (selectedRow) => {
selectedRow.quantity = selectedRow.confirmedQuantity || selectedRow.quantity
 handleAction({url: '/apm/apmDeviceSecondhand/buy/deal', data: selectedRow})
}

const cancelBuy = (selectedRow) => {
 handleAction({url: '/apm/apmDeviceSecondhand/buy/cancel', data: selectedRow})
}


const handleButtonClick = ({ key, row }) => {
  console.log(key, row);
  switch (key) {
    case 'confirmBuy':
      confirmBuy(row);
      break;
    case 'cancelBuy':
      cancelBuy(row);
      break;
    default:
      break;
  }
}

const goBack = () => {
  router.push({ path: '/user/join/oemParts' });
};

onMounted(() => {
  fetchReportDetail();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    internalDemandId.value = newId;
    fetchReportDetail();
  }
}, { immediate: false }); // onMounted handles initial load

</script>
