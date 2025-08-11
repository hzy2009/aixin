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

import { BUSINESS_REF_LIST, TENANT_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const.jsx';

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '爱芯享研发攻关单号', field: 'code', span: 24},
  // {
  //   label: '研发攻关类型', field: 'rdCode', dictKey: 'rd_type', span: 24, fieldType: 'select',
  // },
  {
    label: '产品类别', field: 'productType', fieldType: 'slot', span: 24,
  },
  { label: '需求创建日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '内部管理单号', field: 'internalCode', span: 24, },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'createBy', span: 24, },
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
      groupCode: 'tenantRefList',
      columns: [
          { title: '序号', type: 'seq', width: 48, align: 'center' },
          { title: '研发攻关承接方', field: 'refUserName', align: 'center' },
      ]
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
