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

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  {
    label: '项目编号', field: 'code', fieldType: 'input', span: 24,
  },
  { label: '需求有效期', field: 'expireDate', fieldType: 'date', span: 24, fieldType: 'date' },
  {
    label: '产品类别', field: 'productType', fieldType: 'select', dictKey: 'product_type', span: 24,
  },
  {
    label: '项目分类', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
  },
  // {
  //   label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  // },
  {
    label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true,
  },
  {
    label: '检测验证状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]


const pageTitle = '检测验证详情'

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmInspection/add',
    edit: 'apm/apmInspection/edit',
    detail: 'apm/apmInspection/queryById/front',
    submit: 'apm/apmInspection/submit',
    delete: 'apm/apmInspection/delete',
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
  // router.push('/user/published/verification');
};
const isLoadingRelated = ref(false);

const relatedEvents = ref([]);

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};

</script>
