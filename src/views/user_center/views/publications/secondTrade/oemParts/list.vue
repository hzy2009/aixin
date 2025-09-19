<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage" />
    <FileUploadModal
      :is-visible="showUploadModal"
      @close="showUploadModal = false"
      title="上传数据"
      :upload-url="uploadUrl"
      :template-url="pageData.url.downloadTpl"
      @submit-success="handleSuccess"
    />
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="联系管理员创建" actionText="一键敲门"></PhoneAndEmailModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import FileUploadModal from '@/components/common/FileUploadModal.vue'; // 引入弹窗组件
import { message } from 'ant-design-vue';
import { OEMPARTS_COLUMNS } from '@/utils/const.jsx';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { selectOptions } from '@/utils/index';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import defHttp from '@/utils/http/axios';

// const uploadUrl = `${import.meta.env.VITE_GLOB_UPLOAD_URL}/apm/sys/file/upload` || '/api';
const uploadUrl = `/apm/sys/file/upload/deviceOrigin`;
const router = useRouter();
const route = useRoute();
const refListPage = ref();

const handleActionQuery = (query) => {
  if (query.action === 'create') {
    openModal();
    // 触发后，立即从URL中移除该参数，防止刷新时再次触发
    const newQuery = { ...query };
    delete newQuery.action;
    router.replace({ query: newQuery });
  }
};

// 监听路由参数变化，处理页面内跳转的情况
watch(() => route.query, (newQuery) => {
  handleActionQuery(newQuery);
});

// 组件首次挂载时，也执行一次检查
onMounted(() => {
  handleActionQuery(route.query);
});
const isUploadModalVisible = ref(false); // 控制弹窗显示
const showUploadModal = ref(false);
const phoneAndEmailModal = ref()
// 上传成功后的回调
const handleUploadSuccess = () => {
  refListPage.value?.loadTableData();
};

// 表格列配置 - 使用原厂件列定义
const tableColumns = reactive([
  ...OEMPARTS_COLUMNS,
]);

// 操作按钮配置
const actions = reactive([
  {
    text: '详情',
    icon: FileTextOutlined,
    clickFn: viewDetails,
  }
]);
const getALLProductTypes = () => {
   const allProductTypes = selectOptions('product_type')  
   const allProductTypeMaterials = selectOptions('product_type_material')
   return [{ value: '', label: '全部' }, ...allProductTypes, ...allProductTypeMaterials]
}
// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productStatusCode', label: '零部件状态', maxVisibleWithoutMore: 9, dictKey: 'product_status'},
    { id: 'purchaseMethod', label: '价格类型', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 14, dictKey: 'product_type', options: getALLProductTypes() },
    { id: 'stockStatusName', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', dictKey: 'product_stock_status' },
]);
// 页面数据配置
const pageData = ref({
  url: {
    list: '/apm/apmDeviceOrigin/list/owner',
    upload: '/apm/apmDeviceOrigin/importExcel',
    exportXls: '/apm/apmDeviceOrigin/exportXls',
    downloadTpl: '/apm/apmDeviceOrigin/create/downloadTpl/front', // 新增模板下载地址
  },
  filterConfigForPage,
  tableColumns,
  actions,
  tableOperations: [
    // {
    //   title: '创建需求',
    //   clickFn: () => router.push('/user/published/oemParts/create'),
    //   type: 'primary'
    // },
    {
      title: '上传数据',
      clickFn: openModal, // 修改为打开弹窗
      type: 'primary'
    },
  ],
  tableOperationsRight: [
    {
      title: '导出数据清单',
      btnType: 'exportXls',
      url: '/apm/apmDeviceOrigin/exportXls',
      type: 'primary'
    }
  ]
  // 可以根据需要启用权限控制
  // requiredRoles: ['apm-vip', 'apm-register'],
});

/**
 * 查看详情
 * @param {Object} record - 记录对象
 * @param {string} record.id - 记录ID
 */
function viewDetails({ id }) {
  if (!id) {
    console.error('缺少记录ID');
    return;
  }
  router.push(`/user/published/oemParts/detail/${id}`);
}

const currentUploadFileUrl = ref('');

const handleSuccess = (data) => {
  currentUploadFileUrl.value = data.result[0] || ''
  phoneAndEmailModal.value.openModal()
};

const handleFinish = (data) => {
  let p = {
    ...data,
    downloadUrl: currentUploadFileUrl.value
  }
  defHttp.post({
    url: '/apm/apmDeviceOrigin/create/uploadZip',
    data: p
  }).then(res => {
    if (res.success) {
        phoneAndEmailModal.value.handleClose()
        showUploadModal.value = false;
        refListPage.value?.loadTableData();
        message.success(res.message);
    } else {
      message.error(res.message);
    }
  })
}
function openModal () {
  showUploadModal.value = true
}
</script>
