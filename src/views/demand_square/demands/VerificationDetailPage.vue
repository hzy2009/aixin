<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">检测验证</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack"></detail>
    </template>
    <template #sidebar>
      <VerificationSidebar />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import VerificationSidebar from './components/VerificationSidebar.vue'; // Adjust path if needed
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import { BUSINESS_REF_LIST, TENANT_REF_LIST} from '@/utils/const';

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
    label: '检测验证编号', field: 'code', fieldType: 'input', span: 24,
  },
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24, fieldType: 'date' },
  {
    label: '产品类别', field: 'productType', fieldType: 'select', dictKey: 'product_type', span: 24,
  },
  {
    label: '检测验证类型', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
  },
  // {
  //   label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  // },
  {
    label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true,
  },
  // {
  //   label: '检测验证状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  // },
]

// const statusHistoryColumns = [
//   { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
//   { title: '状态', field: 'operateName', key: 'operateName' },
//   { title: '完成日期', field: 'createTime', key: 'createTime' },
//   { title: '备注', field: 'remark', key: 'remark' },
// ]


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
  // statusHistoryColumns,
  showLogList: false,
  pageTitle,
  tableSections: [
    {
      title: '检查验证承接方',
      ...TENANT_REF_LIST,
    },
    {
      ...BUSINESS_REF_LIST,
    }
  ],
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
