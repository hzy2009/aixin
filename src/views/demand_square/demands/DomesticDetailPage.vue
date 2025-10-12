<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">本土采购</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
       <detail :pageData="pageData" @goBack="goBack" ref="detailRef">
          <template #materialVoList="{ dataSource }">
            <materialVoList :isMaxWidth="true" :data="dataSource.materialVoList" v-if="dataSource.materialVoList && dataSource.materialVoList.length > 0"></materialVoList>
            <span v-else>暂无结果</span>
          </template>
        </detail>
    </template>
    <template #sidebar>
      <DomesticSidebar :count="5" :code="detailRef?.detailData?.code"/>
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import DomesticSidebar from './components/DomesticSidebar.vue'; // Adjust path if needed
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import { BUSINESS_REF_LIST, TENANT_REF_LIST} from '@/utils/const.jsx';
import materialVoList from '@/views/user_center/views/publications/DomesticSourcing/components/materialVoList.vue'

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});
const detailRef = ref()
const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '爱芯享寻源单号', field: 'code', span: 24, },
  { label: '需求提出方', field: 'createBy', span: 24, isMask: true },
  { label: '需求创建日期', field: 'createTime', span: 24, fieldType: 'date' },
  { label: '期望完成日期', field: 'expireDate', span: 24, fieldType: 'date' },
  { label: '寻源结果', field: 'materialVoList', span: 24 , fieldType: 'slot'},
  { label: '寻源状态', field: 'statusName', span: 24 },
]

// const statusHistoryColumns = [
//   { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
//   { title: '状态', field: 'operateName', key: 'operateName' },
//   { title: '完成日期', field: 'createTime', key: 'createTime' },
//   { title: '备注', field: 'remark', key: 'remark' },
// ]

// const demandTypeDisplayName = '本土采购需求';

const pageTitle = '本土采购详情'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmSourcing/add',
    edit: 'apm/apmSourcing/edit',
    detail: 'apm/apmSourcing/queryById/front',
    submit: 'apm/apmSourcing/submit',
    delete: 'apm/apmSourcing/delete',
  },
  otherParams: {
    sourcingType: '国产替代寻源',
  },
  formConfigs,
  // statusHistoryColumns,
  pageTitle,
  queryAfter,
  showLogList: false,
  // tableSections: [
  //   {
  //     title: '物料清单',
  //     groupCode: 'materialList',
  //     columns: [
  //       { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center', align: 'center' },
  //       { title: '爱芯享享单据号', field: 'businessCode', key: 'businessCode' },
  //     ]
  //   },
  //   {
  //     ...TENANT_REF_LIST,
  //     title: '已寻到厂商',
  //   },
  //   {
  //     ...BUSINESS_REF_LIST
  //   }
  // ],
})

const goBack = () => {
  router.push({ path: '/demands/DomesticSourcing' });
};
const isLoadingRelated = ref(false);

const relatedEvents = ref([]);

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};
</script>
