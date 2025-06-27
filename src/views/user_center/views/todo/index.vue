<template>
  <div>
    <listPage :pageData="pageData" >
      <template #tableCustomOperations="{ url, loadTableData }">
        <div class="table-operations">
          <a-tabs v-model:activeKey="activeKey" @change="(v) => handleTabChange(v, loadTableData)">
            <a-tab-pane key="1" tab="全部待办"></a-tab-pane>
            <a-tab-pane key="2" tab="已办理"></a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </listPage>
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
  { id: 'businessType', label: '业务类型', maxVisibleWithoutMore: 9, dictKey: 'business_type', options: 
    [
      { label: '原厂件寻源', value: '原厂件寻源' },
      { label: '线下活动', value: '线下活动' },
    ]
   },
]);

const tableColumns = reactive([
  {type: 'checkbox', width: 34},
  {type: 'seq', title: '序号', width: 74, align: 'center'},
 { title: '单号', field: 'code', align: 'center', width: 180 },
 { title: '业务类型', field: 'businessName', align: 'center', width: 180},
 { title: '需求提出日期', field: 'createTime', align: 'center', fieldType: 'date' },
 { title: '需求状态', field: 'statusName', align: 'center' },
 { title: '操作类型', field: 'remark', align: 'center' },
 { title: '操作历史', field: 'xxx', align: 'center' },
 { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions' },
]);
const activeKey = ref('1');



const actions = reactive([
  {
    text: '编辑',
    icon: FileTextOutlined,
    clickFn: viewDetails,
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  }
]);

const pageData = reactive({
  url: {
    list: 'apm/apmTodo/join/newTodo/list',
  },
  filterConfigForPage,
  tableColumns,
  searchTitle: '待办事项',
  actions,
  tableOperations: [
  ],
  dateRangeConfig: [
    {
      field: 'createTime', // Unique key for this date range
      label: '需求提出日期',
      // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
    },
  ],
})


function viewDetails({businessName, id }) {
    const map = {
        '原厂件寻源': '/user/join/OEMPartsSourcing/detail',
        '线下活动': '/user/join/OfflineEvent/detail',
    };
    const path = map[businessName];
    console.log(map[businessName]);
    router.push(`${path}/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
const handleTabChange = (key, loadTableData) => {
  if (key === '1') {
    pageData.url.list = 'apm/apmTodo/join/newTodo/list';
  } else {
    pageData.url.list = 'apm/apmTodo/join/newTodo/finish/list';
  }
  loadTableData()
}
</script>
<style scoped lang="less">
.table-operations{
  margin-left: 20px;
}
</style>