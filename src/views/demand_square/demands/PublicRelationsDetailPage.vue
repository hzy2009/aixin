<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">研发攻关</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack" class="detail-view-page"></detail>
    </template>
    <template #sidebar>
      <PublicRelationsSidebar />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import PublicRelationsSidebar from './components/PublicRelationsSidebar.vue'; // Adjust path if needed
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import { BUSINESS_REF_LIST, TENANT_REF_LIST} from '@/utils/const';

const authStore = useAuthStore();
const route = useRoute();

const props = defineProps({
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});
const internalDemandId = ref(props.IdProp);


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '研发攻关编号', field: 'code', span: 24 },
  {
    label: '研发攻关类型', field: 'rdType', dictKey: 'rd_type', span: 24,
  },
  {
    label: '期望匹配周期', field: 'matchPeriodName', dictKey: 'rd_breakthrough_period', span: 24,
  },
  
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'createUserName', span: 24, },
  { label: '研发攻关方状态', field: 'statusName', span: 24, },
]

const pageTitle = '研发攻关详情'

const pageData = reactive({
  IdProp: internalDemandId.value,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmRdBreakthrough/add',
    edit: 'apm/apmRdBreakthrough/edit',
    detail: 'apm/apmRdBreakthrough/queryById/front',
    submit: 'apm/apmRdBreakthrough/submit',
    delete: 'apm/apmRdBreakthrough/delete',
  },
  formConfigs,
  // statusHistoryColumns,
  showLogList: false,
  pageTitle,
  tableSections: [
    {
      title: '检测验证承接方',
      ...TENANT_REF_LIST,
    },
    {
      ...BUSINESS_REF_LIST
    }
  ],
})

const goBack = () => {
  router.push({ path: '/demands/PublicRelations' });
};
</script>
<style scoped lang="less">
.detail-view-page{
  width: 894px;
}

</style>
