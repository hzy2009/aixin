<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { USEDEQPTRADE_COLUMNS } from '@/utils/const.jsx';
import { FileTextOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const refListPage = ref();

// 表格列配置 - 使用二手设备列定义
const tableColumns = reactive([
  ...USEDEQPTRADE_COLUMNS
]);

// 操作按钮配置
const actions = reactive([
  {
    text: '详情',
    icon: FileTextOutlined,
    clickFn: viewDetails,
  }
]);

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productType', label: '设备状态', maxVisibleWithoutMore: 9, dictKey: 'secondhand_product_status'},
    { id: 'purchaseMethod', label: '价格类型', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productModelCode', label: '设备类型', maxVisibleWithoutMore: 9, dictKey: 'product_model'},
    { id: 'stockStatusName', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', dictKey: 'product_stock_status' },
]);

// 页面数据配置
const pageData = ref({
  url: {
    list: '/apm/apmDeviceSecondhand/list/join',
  },
  tableColumns,
  actions,
  filterConfigForPage,
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
  router.push(`/user/join/usedEqpTrade/detail/${id}`);
}
</script>