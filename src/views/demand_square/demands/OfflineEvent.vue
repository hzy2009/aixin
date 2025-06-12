<template>
  <div>
    <listPage :pageData="pageData" >
        <template #content="{ dataSource, paginationConfig }">
          <div class="results-grid">
            <OfflineEventCard v-for="event in dataSource" :key="event.id" :event="event" @handleDetails="handleDetails(event)"/>
          </div>
          <a-pagination v-model:current="paginationConfig.current" v-bind="paginationConfig" show-quick-jumper :total="dataSource.length" @change="onChange" />
        </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import OfflineEventCard from './components/OfflineEventCard.vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'statusCode', label: '活动状态', maxVisibleWithoutMore: 7, dictKey: 'activity_status' },
  // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
  { id: 'activityTypeCode', label: '活动类型', maxVisibleWithoutMore: 7, dictKey: 'activity_type' }
]);

const pageData = ref({
  url: {
    list: 'apm/apmOfflineActivity/list/front',
    overview: 'apm/apmOfflineActivity/overview/front'
  },
  filterConfigForPage,
  showBanner: true,
  tableOperations: [
    {
      title: '创建线下活动',
      clickFn: create,
      type: 'primary'
    }
  ],
  searchTitle: '线下活动'
})

const currentPage = ref(1);
const paginationConfig = reactive({
  current: 1,
  pageSize: 10
})
function handleDetails({ id }) {
  router.push(`/demands/OfflineEventDetailPage/${id}`);
};
function create() {
  router.push(`/user/published/OfflineEvent/create`);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';
   .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(580px, 1fr));
    gap: @spacing-lg;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  } 
  .content-section {
    margin-bottom: @spacing-lg;
   &:last-child {
      margin-bottom: 0;
   }
  }
</style>