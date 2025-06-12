<template>
  <div class="industry-report-page">
    <listPage :pageData="pageData">
      <template #content="{ dataSource, paginationConfig }">
        <IndustryReportItem v-for="item in dataSource" :key="item.id" :report="item" />
          <div class="pagination-wrapper">
            <a-pagination size="small" v-model:current="paginationConfig.current" v-bind="paginationConfig" show-quick-jumper :total="dataSource.length" @change="onChange" />
          </div>
      </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import IndustryReportItem from './components/IndustryReportItem.vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'reqPartsType', label: '报告类型', maxVisibleWithoutMore: 7, dictKey: 'report_type' },
  // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
  { id: 'statusCode', label: '报告状态', maxVisibleWithoutMore: 7, dictKey: 'report_status' }
]);

const pageData = ref({
  url: {
    list: 'apm/apmResearchReport/list/front',
    overview: 'apm/apmResearchReport/overview/front'
  },
  // filterConfigForPage,
  showBanner: true,
  searchTitle: '行研报告',
  pageTitle: '行研报告',
})
// const currentPage = ref(1);
// const paginationConfig = reactive({
//   current: 1,
//   pageSize: 10
// })
function viewDetails({ id }) {
  router.push(`/demands/IndustryReportDetailPage/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less';
.industry-report-page {
  min-height: 500px;
}
.pagination-wrapper{
  text-align: right;
  margin-bottom: @spacing-lg;
}
</style>