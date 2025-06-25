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

import { BUSINESS_REF_LIST, TENANT_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const';

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '研发攻关编号', field: 'code', span: 24},
  {
    label: '研发攻关类型', field: 'rdCode', dictKey: 'rd_type', span: 24, fieldType: 'select',
  },
  {
    label: '期望匹配周期', field: 'matchPeriodCode', dictKey: 'rd_breakthrough_period', span: 24, fieldType: 'select'
  },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'tenantName', span: 24, },
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
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  detailPath: '/user/published/PublicRelations/detail',
  listPath: '/user/published/PublicRelations',
  tableSections: [
    {
      title: '研发攻关承接方',
      ...TENANT_REF_LIST
    },
    {
      ...BUSINESS_REF_LIST
    }
  ],
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/PublicRelations');
};

</script>
