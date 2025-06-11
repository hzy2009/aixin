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
   { label: '研发公关编号', field: 'code', span: 24},
  {
    label: '研发攻关方向', field: 'rdType', dictKey: 'rd_type', span: 24,
  },
  {
    label: '期望匹配周期', field: 'matchPeriodName', dictKey: 'rd_breakthrough_period', span: 24,
  },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'tenantName', span: 24, },
]

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
  // tableSections: [
  //   {
  //     title: '研发攻关承接方',
  //     groupCode: 'materialList',
  //     columns: [
  //       { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  //       { title: '物料名称', dataIndex: 'materialName', key: 'materialName', align: 'center' },
  //       { title: '物料数量', dataIndex: 'materialCount', key: 'materialCount', align: 'center' },
  //       { title: '物料单位', dataIndex: 'materialUnit', key: 'materialUnit', align: 'center' },
  //     ]
  //   },
  //   {
  //     title: '关联业务',
  //     groupCode: 'businessRefList',
  //     columns: [
  //       { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center', align: 'center' },
  //       { title: '单据类型', dataIndex: 'businessRefTypeName', key: 'materialName', align: 'center' },
  //       { title: '单据号', dataIndex: 'businessRefCode', key: 'materialCount', align: 'center' },
  //     ]
  //   }
  // ],
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
