<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <TransactionHistoryPage :product="productData" @confirmSell="confirmSell" @buttonClick="handleButtonClick"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DetailTemplate from '@/views/secondTrade/views/components/DetailTemplate.vue';
import TransactionHistoryPage from '@/views/secondTrade/views/components/TransactionHistoryPage.vue';
import { message  } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'

const route = useRoute();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const productData = ref({});
// --- Page Configuration (定义了如何从 `productData` 映射到UI) ---
const productPageConfig = ref({
  pageState: 'detail',
  title: { field: 'productName' },
  mainImage: { field: 'url' },
  tags: [
    { field: 'productStatus' }, // 第一个标签来自 data.condition.label
    { field: 'vendor.name' },      // 第二个标签来自 data.vendor.name
    {
      field: 'inventory.isAvailable',
      formatter: (isAvailable) => isAvailable ? '现货供应' : '暂无现货' // 使用 formatter
    },
  ],  

  basicInfo: [
    { label: '设备厂商', field: 'originalManufacturer' },
    { label: '设备型号', field: 'compatibleModels' },
    {
      label: '设备状态',
      field: 'productStatus',
      highlight: true,
    },
  ],

  productDetailsTitle: '产品详情',

  specifications: [
    { label: '设备名称', field: 'productName' },
    { label: '设备型号', field: 'compatibleModels' },
    { label: '规格描述', field: 'specification' },
    { label: '品牌厂商', field: 'originalManufacturer' },
    { label: '出厂日期', field: 'productionDate' },
    { label: '工艺段', field: 'processSection' },
    { label: '设备状态', field: 'productStatus' },
    { label: '数量', field: 'quantity' },
    // { label: '产品使用说明书', field: 'specs.manualIncluded', formatter: (val) => val === true ? '有' : (val === false ? '无' : val) },
    // { label: '税率', field: 'specs.taxRate', formatter: (val) => val ? `${val}%` : '-' },
  ]
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
      url: '/apm/apmDeviceSecondhand/queryById/front', 
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
    message.error('网络错误，请稍后重试');
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
      data 
    });
    
    if (response.success) {
      message.success(response.message || '操作成功');
      await fetchReportDetail(); // 刷新数据
    } else {
      message.error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('操作失败:', error);
    message.error('网络错误，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};
const confirmBuy = (selectedRow) => {
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
