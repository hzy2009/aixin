<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack"></detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';



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

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
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
  statusHistoryColumns,
  pageTitle,
  tableSections: [
    {
      title: '检查验证方',
      groupCode: 'tenantRefList',
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '检查验证承接方', dataIndex: 'refUserName', key: 'refUserName' },
      ]
    },
    {
      title: '关联业务',
      groupCode: 'businessRefList',
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', align: 'center' },
        { title: '单据类型', dataIndex: 'refBusinessTypeName', key: 'refBusinessTypeName', align: 'center' },
        { title: '单据号', dataIndex: 'refBusinessCode', key: 'refBusinessCode', align: 'center' },
      ]
    }
  ]
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/verification');
};

</script>
