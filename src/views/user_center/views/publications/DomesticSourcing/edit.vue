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
  { label: '计划完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '创建国产替代寻源需求'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmSourcing/add',
    edit: 'apm/apmSourcing/edit',
    detail: 'apm/apmSourcing/queryById',
    submit: 'apm/apmSourcing/submit',
    delete: 'apm/apmSourcing/delete',
  },
  otherParams: {
    sourcingType: '国产替代寻源',
  },
  formConfigs,
  // statusHistoryColumns,
  pageTitle,
  queryAfter,
  detailPath: '/user/published/DomesticSourcing/detail',
  listPath: '/user/published/DomesticSourcing',
})

const goBack = () => {
  router.push({ path: '/user/published/DomesticSourcing' });
};

</script>
