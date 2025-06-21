<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack" ref="detailRef">
      <template #inquiryList="{ dataSource }">
        <inquiryList :data="dataSource.inquiryList" @success="success"></inquiryList>
      </template>
    </detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import inquiryList from './components/inquiryList.vue'
import { useAuthStore } from '@/store/authStore';

import { BUSINESS_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const';


const props = defineProps({
  IdProp: { type: String, default: null },
});
const detailRef = ref();

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '寻源编号', field: 'code', span: 24, },
  { label: '需求提出方', field: 'tenantName', span: 24, },
  { label: '提出需求日期', field: 'createTime', span: 24, fieldType: 'date'},
  { label: '计划完成日期', field: 'expireDate', span: 24 , fieldType: 'date'},
  { label: '寻源结果', field: 'inquiryList', span: 24 , fieldType: 'slot'},
]
// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '原厂件寻源详情'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    detail: 'apm/apmSourcingOriginSubstitute/queryById/owner',
  },
  otherParams: {
    sourcingType: '原厂件寻源',
  },
  formConfigs,
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  queryAfter,
  statusDictKey: 'sourcing_status',
})
const success = () => {
  detailRef.value.fetchDemandDetail();
}
const goBack = () => {
  router.go(-1);
};

</script>
