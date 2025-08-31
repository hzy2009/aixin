<template>
    <DetailTemplate :product="productData" :page-config="productPageConfig" />
    <TransactionHistoryPage :product="productData" @confirmSell="confirmSell" @buttonClick="handleButtonClick" @goBack="goBack"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailTemplate from '@/views/secondTrade/views/components/DetailTemplate.vue';
import TransactionHistoryPage from '@/views/secondTrade/views/components/TransactionHistoryPage.vue';
import { message  } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'

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
  title: { field: 'productName' },
  mainImage: { field: 'imageUrl' },
  tags: [
    { field: 'productStatus' }, // 第一个标签
    { field: 'productTypeName' },      // 第二个标签
  ],  

  basicInfo: [
    { label: '零部件料号', field: 'partNumber' },
    { label: '零部件型号', field: 'productModel' },
    { label: '品牌/制造商', field: 'originalManufacturer' },
    {
      label: '产品状态',
      field: 'productStatus',
      highlight: true,
    },
  ],

  productDetailsTitle: '产品详情',

  productDetailsHtml: 'description',
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
    { label: '备注', field: 'remark' },
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
      url: '/apm/apmDeviceOrigin/queryById', 
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
    message.error('');
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


const goBack = () => {
  router.push({ path: '/user/published/oemParts' });
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
