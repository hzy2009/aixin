<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { OEMPARTS_COLUMNS } from '@/utils/const.jsx';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { selectOptions } from '@/utils/index';

const router = useRouter();
const refListPage = ref();

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
    { id: 'productStatus', label: '零部件状态', maxVisibleWithoutMore: 9, dictKey: 'productStatus', options: [
        { label: '全部', value: '',},
        { label: '全新未拆封', value: '全新未拆封',},
        { label: '拆封未使用', value: '拆封未使用',},
        { label: '拆封已使用 ', value: '拆封已使用',},
    ] },
    { id: 'purchaseMethod', label: '购买形式', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 14, dictKey: 'product_type', options: getALLProductTypes() },
    { id: 'stockStatus', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', options: [
        { label: '全部', value: '',},
        { label: '现货', value: '现货',},
        { label: '非现货', value: '非现货',},
    ] },
]);
// 页面数据配置
const pageData = ref({
  url: {
    list: '/apm/apmDeviceOrigin/list/join',
  },
  filterConfigForPage,
  tableColumns,
  actions,
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
  router.push(`/user/join/oemParts/detail/${id}`);
}
</script>