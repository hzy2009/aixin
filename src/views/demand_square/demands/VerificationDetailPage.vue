<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack"></detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '../../../components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

const props = defineProps({
  demandIdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  {
    label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  },
  { label: '需求有效期', field: 'expireDate', fieldType: 'date', span: 24 },
  {
    label: '产品类别', field: 'productType', fieldType: 'select', dictKey: 'product_type', span: 24,
  },
  {
    label: '项目分类', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
  },
  {
    label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true,
  },
  {
    label: '需求状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]


const pageTitle = '检测验证'

const pageData = reactive({
  demandIdProp: props.demandIdProp,
  mode: props.mode,
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
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/demands/verification');
};

</script>
