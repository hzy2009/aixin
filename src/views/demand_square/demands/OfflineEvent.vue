<template>
  <div>
    <listPage :pageData="pageData" >
        <template #content="{ dataSource, paginationConfig }">
            {{ dataSource }}
             <OfflineEventCard v-for="event in dataSource" :key="event.id" :event="event"/>
            <a-pagination v-model:current="paginationConfig.current" show-quick-jumper :total="dataSource.length" @change="onChange" />
        </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
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
    list: 'apm/apmResearchReport/list/front',
    overview: 'apm/apmResearchReport/overview'
  },
  filterConfigForPage,
  showBanner: true
})

const currentPage = ref(1);
const paginationConfig = reactive({
  current: 1,
  pageSize: 10
})
function viewDetails({ id }) {
  router.push(`/user/published/DomesticSourcing/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>