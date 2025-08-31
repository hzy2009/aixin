<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage">
      <template #tableCustomOperations="{ url, loadTableData }">
        <div class="table-operations" >
          <a-tabs v-model:activeKey="activeKey" @change="(v) => handleTabChange(v, loadTableData)">
            <a-tab-pane key="1" tab="全部待办"></a-tab-pane>
            <a-tab-pane key="2" tab="已办理" v-if="!isSecondTrade"></a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive, computed } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { selectOptions } from '@/utils/index';
import { message as AntMessage } from 'ant-design-vue';
import { useAuthStore } from '@/store/authStore'; // 用于获取用户信息
const router = useRouter();

const authStore = useAuthStore();
const userInfo = computed(() => authStore.userInfo);

const refListPage = ref();
const isSecondTrade = ref(false);

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'businessName', label: '业务类型', maxVisibleWithoutMore: 9, dictKey: 'business_type', selectionType: 'single', options: 
    [
      { label: '原厂件寻源', value: '原厂件寻源',
        onClick: (group, option, helpers) => {
            isSecondTrade.value = false
            changeBusinessName(option.value);
            helpers.toggleFilter(option.value); // 执行默认切换
        }
      },
      { label: '线下活动', value: '线下活动',
        onClick: (group, option, helpers) => {
            isSecondTrade.value = false
            changeBusinessName(option.value);
            helpers.toggleFilter(option.value); // 执行默认切换
        } },
      { label: '原厂件库存处理', value: '原厂件库存处理',
        onClick: (group, option, helpers) => {
            isSecondTrade.value = true
            changeBusinessName(option.value);
            helpers.toggleFilter(option.value); // 执行默认切换
        } },
      { label: '二手设备处理', value: '二手设备处理',
        onClick: (group, option, helpers) => {
            isSecondTrade.value = true
            changeBusinessName(option.value);
            helpers.toggleFilter(option.value); // 执行默认切换
        } },
    ]
   },
]);

const activeKey = ref('1');

const tableColumns1 = [
  {type: 'seq', title: '序号', width: 74, align: 'center'},
  { title: '单号', field: 'code', align: 'center', width: 180 },
  { title: '业务类型', field: 'businessName', align: 'center', width: 180},
  { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date' },
  { title: '需求状态', field: 'statusName', align: 'center' },
  { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions' },
]
const tableColumns2 = [
  {type: 'seq', title: '序号', width: 74, align: 'center'},
  { title: '产品编号', field: 'code', align: 'center' },
  { title: '设备号/零部件料号', field: 'partNumber', align: 'center' },
  // { title: '业务类型', field: 'purchaseMethod', align: 'center', width: 180 },
  { title: '价格类型', field: 'purchaseMethod', align: 'center', width: 180,
    formatter: ({cellValue}) => {
      const purchaseMethodMap = selectOptions('purchase_method').reduce((acc, { value: key, label }) => ({ ...acc, [key]: label }), {});
      const text = purchaseMethodMap[cellValue] || '固定价，不可议价';
      return text;
    }
  },
  { title: '标价', field: 'priceExcludingTax', align: 'center', width: 180,
    formatter: ({cellValue, row}) => {
      if (row.purchaseMethod == 'PRICE_ON_REQUEST') {
        return '**,***,**'
      }
      return cellValue
    }
   },
  { title: '出售数量', field: 'quantity', align: 'center', width: 180 },
  { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions' },
]
const tableConfig = {
  '原厂件寻源': {
    url: 'apm/apmTodo/join/newTodo/list',
    tableColumns: tableColumns1
  },
  '线下活动': {
    url: 'apm/apmTodo/join/newTodo/list',
    tableColumns: tableColumns1
  },
  '原厂件库存处理': {
    url: 'apm/apmDeviceOrigin/list/todo',
    tableColumns: tableColumns2
  },
  '二手设备处理': {
    url: 'apm/apmDeviceSecondhand/list/todo',
    tableColumns: tableColumns2
  },
}
const currentBusiness = ref('原厂件寻源')

const actions = reactive([
  {
    text: '编辑',
    icon: FileTextOutlined,
    clickFn: viewDetails,
    formatText: (record) => {
      if (record.businessName === '原厂件寻源') {
        return '报价';
      } else if ( record.businessName === '线下活动') {
        return '报名';
      }else {
        return '办理';
      }
    }
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  }
]);

const pageData = reactive({
  url: {
    list: 'apm/apmTodo/join/newTodo/list',
  },
  filterConfigForPage,
  initialFilters: {
    businessName_MultiString: '原厂件寻源',
  },
  tableColumns: tableColumns1,
  searchTitle: '待办事项',
  actions,
  tableOperations: [
  ],
  dateRangeConfig: [
    {
      field: 'createTime', // Unique key for this date range
      label: '需求创建日期',
      // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
    },
  ],
   tableOperations: [
        // {
        //     title: '已删除',
        //     type: 'delete',
        //     btnType: 'delete',
        // },
    ],
    isUseFilterDelete: true,
})


function viewDetails({businessName, id, postedBy }) {
    // const map = {
    //     '原厂件寻源': '/user/join/OEMPartsSourcing/detail',
    //     '线下活动': '/user/join/OfflineEvent/detail',
    //     '原厂件库存处理': '/user/join/OEMPartsSourcing/detail',
    //     '二手设备处理': '/user/join/OEMPartsSourcing/detail',
    // };
    // const path = map[businessName];
    let path = ''
    switch (currentBusiness.value) {
        case '原厂件寻源':
            path = '/user/join/OEMPartsSourcing/detail'
            break;
        case '线下活动':
            path = '/user/join/OfflineEvent/detail'
            break;
        case '原厂件库存处理':
            if (postedBy == userInfo.value.realname) {
                path = '/user/published/oemParts/detail'
            } else {
                path = '/user/join/oemParts/detail'
            }
            break;
        case '二手设备处理':
          if (postedBy == userInfo.value.realname) {
                path = '/user/published/usedEqpTrade/detail'
            } else {
                path = '/user/join/usedEqpTrade/detail'
            }
            break;
    }
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

const changeBusinessName = (value) => {
  const { url, tableColumns} = tableConfig[value] || {}
  pageData.url.list = url
  pageData.tableColumns = tableColumns
  currentBusiness.value = value
  // 重新加载数据以应用新的配置
  refListPage.value.loadTableData()
};
</script>
<style scoped lang="less">
.table-operations{
  margin-left: 20px;
}
</style>