<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">原厂件寻源</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack" ref="detailRef">
         <template #inquiryList="{ dataSource }">
          <inquiryList :data="dataSource.inquiryList" :isDetail="true" @success="success" v-if="dataSource.inquiryList && dataSource.inquiryList.length > 0"></inquiryList>
          <span v-else>暂无结果</span>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <OEMPartsSidebar :code="detailRef?.detailData?.code" :count="5"/>
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import OEMPartsSidebar from './components/OEMPartsSidebar.vue'; // Adjust path if needed
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import inquiryList from '@/views/user_center/views/publications/OEMParts/components/inquiryList.vue'
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
  { label: '需求提出方', field: 'createBy', span: 24, isMask: true},
  { label: '需求创建日期', field: 'createTime', span: 24, fieldType: 'date'},
  { label: '期望完成日期', field: 'expireDate', span: 24 , fieldType: 'date'},
  { label: '寻源结果', field: 'inquiryList', span: 24 , fieldType: 'slot'},
  { label: '寻源状态', field: 'statusName', span: 24 },
]

// const statusHistoryColumns = [
//   { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
//   { title: '状态', field: 'operateName', key: 'operateName' },
//   { title: '完成日期', field: 'createTime', key: 'createTime' },
//   { title: '备注', field: 'remark', key: 'remark' },
// ]

// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '原厂件寻源详情'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmSourcingOriginSubstitute/add',
    edit: 'apm/apmSourcingOriginSubstitute/edit',
    detail: 'apm/apmSourcingOriginSubstitute/queryById/front',
    submit: 'apm/apmSourcingOriginSubstitute/submit',
    delete: 'apm/apmSourcingOriginSubstitute/delete',
  },
  otherParams: {
    sourcingType: '原厂件寻源详情',
  },
  formConfigs,
  // statusHistoryColumns,
  showLogList: false,
  pageTitle,
  queryAfter,
  tableSections: [
    {
      title: '物料清单',
      groupCode: 'materialList',
      columns: [
        { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center', align: 'center' },
        { title: '爱芯享享单据号', field: 'businessCode', key: 'businessCode' },
      ]
    },
  ],
})

const goBack = () => {
  router.push({ path: '/demands/OEMPartsSourcing' });
};
const isLoadingRelated = ref(false);

const relatedEvents = ref([]);

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};
</script>
