<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <SimilarProductsSection :config="similarConfig" :basedOnProductId="productData.id" :fieldList="fieldList" :tagList="tagList"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DetailTemplate from '../components/DetailTemplate.vue';
import SimilarProductsSection from '../components/SimilarProductsSection.vue';
import defHttp from '@/utils/http/axios'

const route = useRoute();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const productData = ref({});
// --- Page Configuration (定义了如何从 `productData` 映射到UI) ---
const productPageConfig = ref({
  pageState: 'edit',
  title: { field: 'productName' },
  mainImage: { field: 'url' },
  tags: [
    { field: 'productStatus' }, // 第一个标签来自 data.condition.label
    // {
    //   field: 'inventory.isAvailable',
    //   formatter: (isAvailable) => isAvailable ? '现货供应' : '暂无现货' // 使用 formatter
    // },
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
const fieldList = [
    { key: 'deviceType', label: '设备类型' },
    { key: 'compatibleModels', label: '设备型号' },
    { key: 'originalManufacturer', label: '设备厂商' },
]
const tagList = [
    'productStatus',
    'stockStatus'
]
const similarConfig = ref({
  url: '/apm/apmDeviceOrigin/list/front',
  params: {
    'productGroup': productData.value.productGroup
  },
})
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
