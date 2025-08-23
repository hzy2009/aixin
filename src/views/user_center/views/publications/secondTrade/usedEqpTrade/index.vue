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

// 页面数据配置
const pageData = ref({
  url: {
    list: '/apm/apmDeviceOrigin/list/owner',
  },
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
  router.push(`/user/published/oemParts/detail/${id}`);
}
</script>