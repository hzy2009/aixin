<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack">
      <template #materialVoList="{ dataSource }">
        <materialVoList :data="dataSource.materialVoList"></materialVoList>
      </template>
    </detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import materialVoList from '../../publications/DomesticSourcing/components/materialVoList.vue';
import { useAuthStore } from '@/store/authStore';
import { BUSINESS_REF_LIST, TENANT_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const';


const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '寻源编号', field: 'code', span: 24, },
  { label: '需求提出方', field: 'createUserName', span: 24, },
  { label: '需求提出日期', field: 'createTime', span: 24 , fieldType: 'date'},
  { label: '期望完成日期', field: 'expireDate', span: 24 , fieldType: 'date'},
  { label: '寻源结果', field: 'materialVoList', span: 24 , fieldType: 'slot'},
]


// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '国产替代寻源详情'
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
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  queryAfter,
  detailPath: '/user/published/DomesticSourcing/detail',
  listPath: '/user/published/DomesticSourcing',
  statusDictKey: 'sourcing_status',
})

const goBack = () => {
  router.go(-1);
};

</script>
