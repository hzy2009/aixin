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

import { DOMESTIC_SOURCING_COLUMNS } from '@/utils/const';

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  // { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

const tableColumns = reactive([{type: 'checkbox', width: 34},...DOMESTIC_SOURCING_COLUMNS]);


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
    list: 'apm/apmSourcing/material/list/join',
    overview: 'apm/apmSourcing/overview?referer=join',
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
    // {
    //   title: '创建国产替代寻源',
    //   clickFn: createNewSourcing,
    //   type: 'primary'
    // },
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
      label: '需求提出日期',
      // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
    },
    {
      field: 'expireDate',
      label: '期望完成日期',
    }
  ],
})


function viewDetails({ id }) {
  router.push(`/user/join/DomesticSourcing/detail/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>