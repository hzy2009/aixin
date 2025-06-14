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

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'reqPartsType', label: '分类', maxVisibleWithoutMore: 7, dictKey: 'req_parts_type' },
  { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
  { title: '序号', dataIndex: 'index', key: 'index', textAlign: 'center', width: '60px' },
  { title: '单号', dataIndex: 'code', key: 'code', ellipsis: true, width: '120px' },
  { title: '需求方', dataIndex: 'tenantName', key: 'tenantName', ellipsis: true, },
  { title: '创建日期', dataIndex: 'createTime', key: 'createTime', ellipsis: true, },
  { title: '计划完成日期', dataIndex: 'expireDate', key: 'expireDate', ellipsis: true, width: '120px' },
  { title: '需求数量', dataIndex: 'reqPartsTotal', key: 'reqPartsTotal', ellipsis: true, },
  { title: '需求状态', dataIndex: 'statusName', key: 'statusName', ellipsis: true, width: '80px' },
  { title: '已寻到数量', dataIndex: 'reqPartsFinish', key: 'reqPartsFinish', ellipsis: true, },
  { title: '未寻到数量', dataIndex: 'reqPartsUnfinish', key: 'reqPartsUnfinish', ellipsis: true, 
    customRender: ({record}) => {
      const { reqPartsTotal, reqPartsFinish } = record;
      // 计算未完成数量
      const reqPartsUnfinish = reqPartsTotal - reqPartsFinish;
      return <span>{reqPartsUnfinish || '-'}</span>;
    }
  },
  { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]);

const addButton = reactive({
  text: '创建国产替代寻源',
  clickFn: createNewSourcing
})

const actions = reactive([
  {
    text: '详情',
    icon: FileTextOutlined,
    clickFn: viewDetails,
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  }
]);

const pageData = ref({
  url: {
    list: 'apm/apmSourcing/list/owner',
    overview: 'apm/apmSourcing/overview',
  },
  otherParams: {
    sourcingType: '国产替代寻源'
  },
  filterConfigForPage,
  tableColumns,
  addButton,
  actions,
  statusDictKey: 'sourcing_status',
  userStatCardVisible: true,
  tableOperations: [
    {
      title: '创建国产替代寻源',
      clickFn: createNewSourcing,
      type: 'primary'
    },
    {
      title: '下载',
      type: 'primary',
      btnType: 'exportXls',
      fileName: '国产替代寻源',
      url: 'apm/apmSourcing/exportXls',
      otherParams: {
        sourcingType: '国产替代寻源'
      }
    }
  ],
  dateRangeConfig: [
    {
      field: 'createTime', // Unique key for this date range
      label: '提出需求日期',
      // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
    },
    {
      field: 'expireDate',
      label: '计划完成日期',
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