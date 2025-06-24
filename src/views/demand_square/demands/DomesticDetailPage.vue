<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">国产替代寻源</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack"></detail>
    </template>
    <template #sidebar>
      <RelatedItemsSidebar title="其他" :items="relatedEvents" :is-loading="isLoadingRelated" empty-description="暂无其他推荐"
        @item-click="navigateToRelatedEvent" />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import RelatedItemsSidebar from '@/components/common/RelatedItemsSidebar.vue'; // Adjust path if needed
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import { BUSINESS_REF_LIST, TENANT_REF_LIST} from '@/utils/const';

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '寻源编号', field: 'code', span: 24, },
  { label: '需求提出方', field: 'tenantName', span: 24, },
  { label: '提出需求日期', field: 'createTime', span: 24, fieldType: 'date' },
  { label: '计划完成日期', field: 'expireDate', span: 24, fieldType: 'date' },
  { label: '寻源结果', field: 'statusName', span: 24 },
  { label: '贸易商/晶链慧采：', field: 'xxx', span: 24 },
]

// const statusHistoryColumns = [
//   { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
//   { title: '状态', field: 'operateName', key: 'operateName' },
//   { title: '完成日期', field: 'createTime', key: 'createTime' },
//   { title: '备注', field: 'remark', key: 'remark' },
// ]

// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '国产替代寻源详情'
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
  tableSections: [
    {
      title: '物料清单',
      groupCode: 'materialList',
      columns: [
        { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center', align: 'center' },
        { title: '爱芯享单据号', field: 'businessCode', key: 'businessCode' },
      ]
    },
    {
      ...TENANT_REF_LIST,
      title: '已寻到厂商',
    },
    {
      ...BUSINESS_REF_LIST
    }
  ],
})

const goBack = () => {
  router.go(-1);
};
const isLoadingRelated = ref(false);

const relatedEvents = ref([]);

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};
</script>
