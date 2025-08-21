<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <TransactionHistoryPage :product="productData" @confirmSell="confirmSell" @buttonClick="handleButtonClick"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DetailTemplate from '../components/DetailTemplate.vue';
import TransactionHistoryPage from '../components/TransactionHistoryPage.vue';
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
    { label: '零部件料号', field: 'partNumber' },
    { label: '零部件型号', field: 'compatibleModels' },
    { label: '品牌/制造商', field: 'originalManufacturer' },
    {
      label: '设备状态',
      field: 'productStatus',
      highlight: true,
    },
  ],

  productDetailsTitle: '产品详情',

  specifications: [
    { label: '规格', field: 'specification' },
    { label: '生产日期', field: 'productionDate' },
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
const internalDemandId = ref(props.IdProp);

async function fetchReportDetail() {
  if (!props.IdProp) return;
  isLoading.value = true;
  try {
    // TODO: API 调用 - 获取报告详情
    const response = await defHttp.get({ url: '/apm/apmDeviceOrigin/queryById/front', params: { id: internalDemandId.value } });
    productData.value = response.result;
  } catch (err) {
    console.error("获取详情失败:", err);
    productData.value = null;
  } finally {
    isLoading.value = false;
  }
}
const handleAction = ({url, data}) => {
  isLoading.value = true;
  defHttp.post({ url: `${url}/${internalDemandId.value}`, data}).then((res) => {
    if (res.success) {
      message.success(res.message);
      fetchReportDetail();
    } else {
      message.error(res.message);
    }
  }).finally(() => {
    isLoading.value = false;
  });
}
const confirmSell = (selectedRow) => {
 handleAction({url: '/apm/apmDeviceOrigin/sale/confirm', data: selectedRow})
}

const cancelSale = (selectedRow) => {
 handleAction({url: '/apm/apmDeviceOrigin/sale/cancel', data: selectedRow})
}

const handledeal = (selectedRow) => {
  handleAction({url: '/apm/apmDeviceOrigin/sale/deal', data: selectedRow})
}
const handleButtonClick = ({ key, row }) => {
  console.log(key, row);
  switch (key) {
    case 'confirmSale':
      confirmSell(row);
      break;
    case 'cancelSale':
      cancelSale(row);
      break;
    case 'deal':
      handledeal(row);
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
