<template>
  <div>
    <listPage :pageData="pageData" />
  </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
const router = useRouter();
import { DOMESTIC_SOURCING_COLUMNS } from '@/utils/const.jsx';
// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  // { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 9, dictKey: 'sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
  {type: 'checkbox', width: 34},
  { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
  { title: '爱芯享寻源单号', field: 'code', align: 'center', width: 170 },
  { title: '需求方', field: 'createBy', align: 'center', width: 170 },
  { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 100},
  { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 100},
  { title: '内部管理单号', field: 'materialCode', align: 'center', width: 130 },
  { title: '选定厂商', field: 'refUserCode', align: 'center', width: 156  },
  { title: '需求状态', field: 'statusName', align: 'center', width: 90 },
  { title: '操作', width: '160px', align: 'center', fixed: 'right', key: 'actions' },
]);

const addButton = reactive({
  text: '创建需求',
  clickFn: createNewSourcing
})

const actions = reactive([
  {
    text: '详情',
    clickFn: viewDetails,
    type: 'detail',
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  },
  {
    text: '删除',
    type: 'del',
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  },
]);

const pageData = ref({
  url: {
    list: 'apm/apmSourcing/material/list/owner',
    delete: 'apm/apmSourcing/delete',
    overview: 'apm/apmSourcing/overview?referer=owner',
  },
  otherParams: {
    sourcingType: '国产替代寻源'
  },
  filterConfigForPage,
  tableColumns,
  addButton,
  actions,
  searchTitle: '多元化寻源',
  statusDictKey: 'sourcing_status',
  userStatCardVisible: true,
  tableOperations: [
    {
      title: '创建多元化寻源',
      clickFn: createNewSourcing,
      type: 'primary'
    },
    {
      title: '下载',
      type: 'primary',
      btnType: 'exportXls',
      fileName: '多元化寻源',
      url: 'apm/apmSourcing/exportXls',
      otherParams: {
        sourcingType: '国产替代寻源'
      }
    },
    {
        title: '已删除',
        type: 'delete',
        btnType: 'delete',
    },
  ],
  dateRangeConfig: [
    {
      field: 'createTime', // Unique key for this date range
      label: '需求创建日期',
      // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
    },
    {
      field: 'expireDate',
      label: '期望完成日期',
    }
  ],
})


function viewDetails({ id }) {
  router.push(`/user/published/DomesticSourcing/detail/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>