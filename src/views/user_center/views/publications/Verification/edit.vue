<template>
  <div>
    <edit :pageData="pageData" @goBack="goBack"/>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import edit from '@/components/template/edit.vue';
import { useAuthStore } from '@/store/authStore';



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
    label: '需求提出方', field: 'createBy', fieldType: 'input', span: 24, disabled: true,
  },
  // {
  //   label: '产品类别', field: 'productType', fieldType: 'select', dictKey: 'product_type', span: 24,
  // },
   {
    label: '产品类别', field: 'productType', fieldType: 'erjisb', span: 24,
  },
  {
    label: '检测验证类别', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
    onChange: ({form, option}) => {
      form.projectName = option.label || '';
    }
  },
  // {
  //   label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  // },
  { label: '需求创建日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '电话', field: 'phone', fieldType: 'phone', span: 24 },
  { label: '邮箱', field: 'email', fieldType: 'email', span: 24 },
  // {
  //   label: '需求状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  // },
]

const statusHistoryColumns = [
  { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
  { title: '状态', field: 'operateName', key: 'operateName' },
  { title: '完成日期', field: 'createTime', key: 'createTime' },
  { title: '备注', field: 'remark', key: 'remark' },
]


const pageTitle = '创建检测验证需求'

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
  statusHistoryColumns,
  pageTitle,
  detailPath: '/user/published/Verification/detail',
  listPath: '/user/published/Verification',
})

const goBack = () => {
  // router.go(-1);
  router.push('/user/published/verification');
};

</script>
