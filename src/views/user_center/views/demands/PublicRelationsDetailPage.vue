<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack"></detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from './components/detail.vue';
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
  { label: '研发公关方向', field: 'rdType', fieldType: 'select', dictKey: 'rd_type', span: 24, disabled: isManagerAdmin.value },
  { label: '研发公关需求', field: 'sourceDesc', fieldType: 'input', span: 24, disabled: isManagerAdmin.value },
  {
    label: '研发公关最新需求状态', field: 'statusCode', fieldType: 'select', dictKey: 'rd_breakthrough_status', span: 24, disabled: !isManagerAdmin.value,
    onChange: ({ value, form, options }) => {
      form.statusName = options.find(opt => opt.value === value)?.label || '';
    }
  },
  { label: '需求有效期', field: 'expireDate', fieldType: 'date', rules: [{ required: true, message: '必填!' }], span: 24, disabled: isManagerAdmin.value },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

const demandTypeDisplayName = '研发攻关';

const pageTitle = computed(() => {
  if (props.mode === 'create') {
    return `新建${demandTypeDisplayName}`;
  }
  return `${demandTypeDisplayName}详情`;
});

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
  router.push('/user/demands/PublicRelations'); 
};

</script>

<style scoped lang="less">
@import './styles/detail.less';
</style>