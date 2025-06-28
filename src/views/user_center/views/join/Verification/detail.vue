<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack">
       <template #productType="{ dataSource }">
        <div><span>{{ dataSource.productMainTypeName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ dataSource.productTypeName }}</span></div>
      </template>
    </detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import { BUSINESS_REF_LIST, STATUS_HISTORY_COLUMNS, TENANT_REF_LIST } from '@/utils/const';



const props = defineProps({
  IdProp: { type: String, default: null },
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  {
    label: '检测验证编号', field: 'code', span: 24,
  },
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24, fieldType: 'date' },
  {
    label: '产品类别', field: 'productType', fieldType: 'slot', span: 24,
  },
  {
    label: '检测验证类别', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
  },
  // {
  //   label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  // },
  {
    label: '需求提出方', field: 'createUserName', span: 24, disabled: true,
  },
  // {
  //   label: '检测验证状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  // },
]


const pageTitle = '检测验证详情'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmInspection/add',
    edit: 'apm/apmInspection/edit',
    detail: 'apm/apmInspection/queryById',
    submit: 'apm/apmInspection/submit',
    delete: 'apm/apmInspection/delete',
  },
  formConfigs,
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  detailPath: '/user/published/Verification/detail',
  listPath: '/user/published/Verification',
  tableSections: [
    {
      title: '检查验证方',
      ...TENANT_REF_LIST
    },
    {
      ...BUSINESS_REF_LIST
    }
  ]
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/verification');
};

</script>
