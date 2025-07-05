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
  // { id: 'statusCode', label: '寻源结果', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([...DOMESTIC_SOURCING_COLUMNS]);


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
    list: 'apm/apmSourcing/material/list/front',
    overview: 'apm/apmSourcing/overview/front'
  },
  otherParams: {
    sourcingType: '国产替代寻源'
  },
  filterConfigForPage,
  tableColumns,
  actions,
  showBanner: true,
  userStatCardVisible: true,
  pageTitle: '多元化寻源',
  statusDictKey: 'sourcing_status',
  tableOperations: [
    {
      title: '创建多元化寻源',
      clickFn: createNewSourcing,
      type: 'primary'
    }
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
  searchTitle: '多元化寻源'
})


function viewDetails({ id }) {
  router.push(`/demands/DomesticDetailPage/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>
