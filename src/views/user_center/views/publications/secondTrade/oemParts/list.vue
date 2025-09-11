<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage" />
    <ExcelUploadModal
      v-model:visible="isUploadModalVisible"
      title="上传数据"
      :action="pageData.url.importExcel"
      :templateUrl="pageData.url.downloadTpl"
      @success="handleUploadSuccess"
    />
    <FileUploadModal
      :is-visible="showUploadModal"
      @close="showUploadModal = false"
      title="创建国产替代寻源需求"
      upload-url="/api/your/upload/endpoint"
      template-url="/templates/demand_template.xlsx"
      :upload-headers="{ 'Authorization': `Bearer ${token}` }"
      :requirements="customRequirements"
      @submit-success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import ExcelUploadModal from '@/components/common/ExcelUploadModal.vue'; // 引入弹窗组件
import FileUploadModal from '@/components/common/FileUploadModal.vue'; // 引入弹窗组件
import { OEMPARTS_COLUMNS } from '@/utils/const.jsx';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { selectOptions } from '@/utils/index';

const router = useRouter();
const refListPage = ref();
const isUploadModalVisible = ref(false); // 控制弹窗显示
const showUploadModal = ref(false);
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
    { id: 'productStatusName', label: '零部件状态', maxVisibleWithoutMore: 9, dictKey: 'product_status'},
    { id: 'purchaseMethod', label: '购买形式', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 14, dictKey: 'product_type', options: getALLProductTypes() },
    { id: 'stockStatusName', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', dictKey: 'product_stock_status' },
]);
// 页面数据配置
const pageData = ref({
  url: {
    list: '/apm/apmDeviceOrigin/list/owner',
    importExcel: '/apm/apmDeviceOrigin/importExcel',
    exportXls: '/apm/apmDeviceOrigin/exportXls',
    downloadTpl: '/apm/apmDeviceOrigin/downloadTpl', // 新增模板下载地址
  },
  filterConfigForPage,
  tableColumns,
  actions,
  tableOperations: [
    {
      title: '创建需求',
      clickFn: () => router.push('/user/published/oemParts/create'),
      type: 'primary'
    },
    {
      title: '上传数据',
      clickFn: () => { showUploadModal.value = true; }, // 修改为打开弹窗
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
</script>
