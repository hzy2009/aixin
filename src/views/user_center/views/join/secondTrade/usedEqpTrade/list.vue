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
    { id: 'purchaseMethod', label: '购买形式', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'deviceType', label: '设备类型', maxVisibleWithoutMore: 9, options: [
        { label: '全部', value: ''},
        { label: '光刻设备(Lithography)', value: '光刻设备(Lithography)',},
        { label: '刻蚀设备(Etch)', value: '刻蚀设备(Etch)',},
        { label: '化学机械抛光设备(CMP)', value: '化学机械抛光设备(CMP)',},
        { label: '物理气相沉积设备(PVD)', value: '物理气相沉积设备(PVD)',},
        { label: '化学气相沉积设备(CVD)', value: '化学气相沉积设备(CVD)',},
        { label: '离子注入设备(Implant)', value: '离子注入设备(Implant)',},
        { label: '快速热处理设备(RTP)', value: '快速热处理设备(RTP)',},
        { label: '量测设备(Metrology)', value: '量测设备(Metrology)',}
    ]},
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