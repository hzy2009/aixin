<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <SimilarProductsSection :similarConfig="similarConfig" :basedOnProductId="productData.id" :fieldList="fieldList" :tagList="tagList"/>
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
  mainImage: { field: 'imageUrl' },
  tags: [
    { field: 'productStatus' }, // 第一个标签来自 data.condition.label
 
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
    { label: '规格', field: 'specification' },
    { label: '生产日期', field: 'productionDate' },
    { label: '使用时长', field: 'usageDuration' },
    { label: '质保期', field: 'guaranteePeriod' },
    { label: '工艺段', field: 'processSection' },
    { label: '产品使用说明书', field: 'hasUserManual',formatter: (value) => value ? '有' : '无' },
    { label: '税率', field: 'tax', formatter: (value) => value + '%' },
    { label: '付款条件', field: 'paymentTermsName' },
    { label: '适用设备型号', field: 'compatibleModels' },
    { label: '物流方式', field: 'shippingTypeName' },
    { label: '交期', field: 'deliveryDuration' },
    { label: '到货时间', field: 'deliveryDate' },
    // { label: '产品使用说明书', field: 'specs.manualIncluded', formatter: (val) => val === true ? '有' : (val === false ? '无' : val) },
    // { label: '税率', field: 'specs.taxRate', formatter: (val) => val ? `${val}%` : '-' },
  ]
});
const isLoading = ref(false);
const internalDemandId = ref(props.IdProp);

const similarConfig = ref({
  url: '/apm/apmDeviceSecondhand/list/front',
  params: {
    'productGroup': productData.value.productGroup
  },
})
async function fetchReportDetail() {
  if (!props.IdProp) return;
  isLoading.value = true;
  try {
    // TODO: API 调用 - 获取报告详情
    const response = await defHttp.get({ url: '/apm/apmDeviceSecondhand/queryById/front', params: { id: internalDemandId.value } });
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
