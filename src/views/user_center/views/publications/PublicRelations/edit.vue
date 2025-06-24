<template>
  <div>
    <edit :pageData="pageData" @goBack="goBack"></edit>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import edit from '@/components/template/edit.vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// --- 表单配置 ---
const formConfigs = [
  { label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true, },
  {
    label: '研发攻关类型', field: 'rdCode', fieldType: 'select', detailField: 'rdType', dictKey: 'rd_type', span: 24,
    onChange: ({ value, form, option }) => {
      form.rdType = option.label || '';
    }
  },
  {
    label: '期望匹配周期', field: 'matchPeriodCode', fieldType: 'select', dictKey: 'rd_breakthrough_period', span: 24,
    onChange: ({ value, form, option }) => {
      form.matchPeriodName = option.label || '';
    }
  },
]

const statusHistoryColumns = [
  { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center' },
  { title: '状态', field: 'operateName', key: 'operateName' },
  { title: '完成日期', field: 'createTime', key: 'createTime' },
  { title: '备注', field: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '研发攻关';

const pageTitle = '创建研发攻关需求'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmRdBreakthrough/add',
    edit: 'apm/apmRdBreakthrough/edit',
    detail: 'apm/apmRdBreakthrough/queryById',
    submit: 'apm/apmRdBreakthrough/submit',
    delete: 'apm/apmRdBreakthrough/delete',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  detailPath: '/user/published/PublicRelations/detail',
  listPath: '/user/published/PublicRelations',
})

const goBack = () => {
  // router.go(-1);
  router.push('/user/published/PublicRelations');
};

</script>
