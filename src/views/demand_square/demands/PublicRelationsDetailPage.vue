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
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  {
    label: '研发攻关方向', field: 'rdCode', fieldType: 'select', detailField: 'rdType', dictKey: 'rd_type', span: 24,
    onChange: ({ value, form, options }) => {
      form.rdType = options.find(opt => opt.value === value)?.label || '';
    }
  },
  { label: '创建日期', field: 'createTime', fieldType: 'date', span: 24, disabled: true, mode: 'view' },
  { label: '研发需求', field: 'sourceDesc', fieldType: 'input', span: 24 },
  {
    label: '需求状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', dictKey: 'rd_breakthrough_status', span: 24, disabled: true
  },
  {
    label: '期望匹配周期', field: 'matchPeriodCode', detailField: 'matchPeriodName', fieldType: 'select', dictKey: 'rd_breakthrough_period', span: 24,
    onChange: ({ value, form, options }) => {
      form.matchPeriodName = options.find(opt => opt.value === value)?.label || '';
    }
  },
  // { label: '需求有效期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true, },
].filter(item => {
  if (props.mode == 'create' && item.mode == 'view') {
    return false;
  }
  return true;
}
);

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '研发攻关';

const pageTitle = '研发攻关'

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmRdBreakthrough/add',
    edit: 'apm/apmRdBreakthrough/edit',
    detail: 'apm/apmRdBreakthrough/queryById/front',
    submit: 'apm/apmRdBreakthrough/submit',
    delete: 'apm/apmRdBreakthrough/delete',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  tableSections: [
    {
      title: '研发攻关承接方',
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
  // router.push('/user/published/PublicRelations');
};
const isLoadingRelated = ref(false);

const relatedEvents = ref([]);

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};

</script>
