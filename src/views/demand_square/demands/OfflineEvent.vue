<template>
  <div>
    <listPage :pageData="pageData" ref="refListPage">
      <template #content="{ dataSource, paginationConfig }">
        <div class="results-grid">
          <OfflineEventCard v-for="event in dataSource" :key="event.id" :event="event"
            @handleDetails="handleDetails(event)" />
        </div>
        <div class="pagination-wrapper">
          <a-pagination size="small" v-model:current="paginationConfig.current" v-bind="{...paginationConfig, showSizeChanger: false}"
            show-quick-jumper :total="paginationConfig.total" @change="onChange" />
        </div>
      </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import OfflineEventCard from './components/OfflineEventCard.vue';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

const authStore = useAuthStore();
const modalStore = useModalStore();

const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'statusCode', label: '活动状态', maxVisibleWithoutMore: 7, dictKey: 'activity_status' },
  // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
  { id: 'activityTypeCode', label: '活动类型', maxVisibleWithoutMore: 7, dictKey: 'activity_type' }
]);
const refListPage = ref();
const pageData = ref({
  url: {
    list: 'apm/apmOfflineActivity/list/front',
    overview: 'apm/apmOfflineActivity/overview/front'
  },
  filterConfigForPage,
  showBanner: true,
  statusDictKey: 'activity_status',
  userStatCardVisible: true,
  tableOperations: [
    {
      title: '创建线下活动',
      clickFn: create,
      type: 'primary'
    }
  ],
  pageTitle: '线下活动',
  searchTitle: '线下活动',
  listPageisPadding: false
})

const currentPage = ref(1);
const paginationConfig = reactive({
  current: 1,
  pageSize: 10
})
function handleDetails({ id }) {
  if (authStore?.token) {
    router.push(`/demands/OfflineEventDetailPage/${id}`);
  } else {
    modalStore.showLogin();
  }
};
function create() {
  router.push(`/user/published/OfflineEvent/create`);
};
const onChange = (page, pageSize) => {
  // window.scrollTo({
  //   top: 500,
  //   behavior: 'smooth'
  // });
  refListPage.value.handleTablePaginationChange({
    current: page,
    pageSize
  });
}
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

.pagination-wrapper {
  // 定位到右边
  text-align: right;
  margin-bottom: @spacing-lg;
}
</style>