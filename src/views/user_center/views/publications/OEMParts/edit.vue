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
import dayjs from 'dayjs';

const props = defineProps({
  IdProp: { type: String, default: null },
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true, },
  { label: '提出需求日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center', align: 'center' },
  { title: '状态', field: 'operateName', key: 'operateName' },
  { title: '完成日期', field: 'createTime', key: 'createTime' },
  { title: '备注', field: 'remark', key: 'remark' },
]


const pageTitle = '原厂件寻源'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmSourcingOriginSubstitute/add',
    edit: 'apm/apmSourcingOriginSubstitute/edit',
    detail: 'apm/apmSourcingOriginSubstitute/queryById',
    submit: 'apm/apmSourcingOriginSubstitute/submit',
    delete: 'apm/apmSourcingOriginSubstitute/delete',
  },
  otherParams: {
    sourcingType: '原厂件寻源',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  detailPath: '/user/published/OEMPartsSourcing/detail',
  listPath: '/user/published/OEMPartsSourcing',
})

const goBack = () => {
  router.push('/user/published/OEMPartsSourcing');
};

</script>
