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

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '研发公关编号', field: 'code', span: 24},
  {
    label: '研发攻关类型', field: 'rdType', dictKey: 'rd_type', span: 24,
  },
  {
    label: '期望匹配周期', field: 'matchPeriodName', dictKey: 'rd_breakthrough_period', span: 24,
  },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'tenantName', span: 24, },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '研发攻关';

const pageTitle = '研发攻关详情'

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
  tableSections: [
    {
      title: '研发攻关承接方',
      groupCode: 'tenantRefList',
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '研发攻关承接方', dataIndex: 'refUserName', key: 'refUserName' },
      ]
    },
    {
      title: '关联业务',
      groupCode: 'businessRefList',
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', align: 'center' },
        { title: '单据类型', dataIndex: 'businessRefTypeName', key: 'materialName', align: 'center' },
        { title: '单据号', dataIndex: 'businessRefCode', key: 'materialCount', align: 'center' },
      ]
    }
  ],
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/PublicRelations');
};

</script>
