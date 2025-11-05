<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <SimilarProductsSection @handleDetails="handleDetails" :config="similarConfig" :basedOnProductId="productData.id" :fieldList="fieldList" :tagList="tagList" :product="productData"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailTemplate from '../components/DetailTemplate.vue';
import SimilarProductsSection from '../components/SimilarProductsSection.vue';
import {USEDEQPTRADEDETAIL} from '@/utils/const.jsx';
import defHttp from '@/utils/http/axios'

const route = useRoute();
const router = useRouter();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const productData = ref({});
// --- Page Configuration (定义了如何从 `productData` 映射到UI) ---
const productPageConfig = ref({
  newTodoUrl: '/apm/apmDeviceSecondhand/buy/newTodo',
  pageState: 'edit',
  ...USEDEQPTRADEDETAIL,
  successAction: () => {
    router.push('/secondTrade/usedEqpTrade');
  },
  viewDetailAction: (productId) => {
    router.push(`/user/join/usedEqpTrade/detail/${productId}`);
  },
  hidePrice: true
});
const isLoading = ref(false);
const internalDemandId = ref(props.IdProp);
const fieldList = [
    { key: 'deviceType', label: '设备类型' },
    { key: 'productModelName', label: '设备型号' },
    { key: 'originalManufacturer', label: '设备厂商' },
]
const tagList = [
    'productStatusName',
    'stockStatusName',
    'productSource'
]
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
const handleDetails = (item) => {
    router.push({
        path: `/secondTrade/usedEqpTrade/details/${item.id}`,
    })
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
