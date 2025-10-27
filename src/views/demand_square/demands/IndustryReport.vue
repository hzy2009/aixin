<template>
  <div class="industry-report-page">
    <listPage :pageData="pageData" ref="refListPage">
      <template #content="{ dataSource, paginationConfig, handleTablePaginationChange }">
        <IndustryReportItem v-for="item in dataSource" :key="item.id" :report="item" />
          <div class="pagination-wrapper" ref="paginationRef">
            <a-pagination size="small" v-model:current="paginationConfig.current" v-bind="{...paginationConfig, showSizeChanger: false}"
            :showTotal="(total) => `共 ${total} 条记录`"
            show-quick-jumper :total="paginationConfig.total" @change="(currentPage, pageSize) => onPageChange(currentPage, pageSize, handleTablePaginationChange)" />
          </div>
      </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import IndustryReportItem from './components/IndustryReportItem.vue';
const router = useRouter();

const refListPage = ref();
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
  listPageisPadding: false,
  requiredRoles: ['all']
})

const paginationRef = ref(null);

const onPageChange = async (currentPage, pageSize, handleTablePaginationChange) => {
  if (!paginationRef.value) {
    await handleTablePaginationChange({ currentPage, pageSize });
    return;
  }

  const oldTop = paginationRef.value.getBoundingClientRect().top;

  await handleTablePaginationChange({ currentPage, pageSize });

  await nextTick();

  const newTop = paginationRef.value.getBoundingClientRect().top;
  const scrollOffset = newTop - oldTop;

  if (scrollOffset !== 0) {
    window.scrollBy(0, scrollOffset);
  }
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