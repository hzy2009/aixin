<template>
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

const authStore = useAuthStore();

const props = defineProps({
  demandIdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '计划完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '创建日期', field: 'createTime', fieldType: 'date', span: 24 },
  { label: '需求数量', field: 'reqPartsTotal', fieldType: 'number', span: 24 },
  { label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, },
  {
    label: '需求状态', field: 'statusName', fieldType: 'input', span: 24,
  },
  { label: '已寻到数量', field: 'reqPartsFinish', fieldType: 'number', span: 24 },
  { label: '未寻到数量', field: 'reqPartsUnfinish', fieldType: 'number', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '国产替代寻源'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  demandIdProp: props.demandIdProp,
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
  statusHistoryColumns,
  pageTitle,
  queryAfter,
  tableSections: [
    {
      title: '物料清单',
      groupCode: 'materialList',
      columns: [
        { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', align: 'center' },
        { title: '物料数量', dataIndex: 'materialCount', key: 'materialCount', align: 'center' },
        { title: '物料单位', dataIndex: 'materialUnit', key: 'materialUnit', align: 'center' },
      ]
    },
    {
      title: '关联业务',
      groupCode: 'businessRefList',
      columns: [
        { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center', align: 'center' },
        { title: '单据类型', dataIndex: 'businessRefTypeName', key: 'materialName', align: 'center' },
        { title: '单据号', dataIndex: 'businessRefCode', key: 'materialCount', align: 'center' },
      ]
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
