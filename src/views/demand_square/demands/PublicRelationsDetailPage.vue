<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">定制开发</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack" class="detail-view-page" ref="detailRef">
        <template #productType="{ dataSource }">
          <div><span>{{ dataSource.productMainTypeName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ dataSource.productTypeName }}</span></div>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <PublicRelationsSidebar :code="detailRef?.detailData?.code"/>
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
import { BUSINESS_REF_LIST, TENANT_REF_LIST} from '@/utils/const.jsx';

const authStore = useAuthStore();
const route = useRoute();

const props = defineProps({
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});
const internalDemandId = ref(props.IdProp);
const detailRef = ref(null);

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '爱芯享定制开发单号', field: 'code', span: 24 },
  // {
  //   label: '定制开发类型', field: 'rdType', dictKey: 'rd_type', span: 24,
  // },
  {
    label: '产品类别', field: 'productType', fieldType: 'slot', span: 24,
  },
  { label: '需求创建日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '内部管理单号', field: 'internalCode', fieldType: 'input', span: 24, },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'createBy', span: 24, isMask: true },
  { label: '定制开发方状态', field: 'statusName', span: 24, },
]

const pageTitle = '定制开发详情'

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
      title: '定制开发承接方',
      groupCode: 'tenantRefList',
      columns: [
          { title: '序号', type: 'seq', width: 48, align: 'center' },
          { title: '定制开发承接方', field: 'refUserName', align: 'center' },
      ]
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
