<template>
    <div class="industry-Talent-page">
        <listPage :pageData="pageData">
            <template #content="{ dataSource, paginationConfig, handleTablePaginationChange }">
                <div class="results-grid content-section">
                    <TalentProfileCard v-for="item in dataSource" :key="item.id" :talent="item" @handleDetail="viewDetails"/>
                </div>
                <div class="pagination-wrapper" ref="paginationRef">
                    <a-pagination size="small" v-bind="{...paginationConfig, showSizeChanger: false }"
                        show-quick-jumper @change="(currentPage, pageSize) => onPageChange(currentPage, pageSize, handleTablePaginationChange)" 
                        :showTotal="(total) => `共 ${total} 条记录`"
                    />
                </div>
            </template>
        </listPage>
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive, nextTick } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import TalentProfileCard from './components/TalentProfileCard.vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'skillAreaCode', label: '研究领域', maxVisibleWithoutMore: 14, dictKey: 'skill_area' },
]);
const initialPageSize = 12
const pageData = ref({
    url: {
        list: 'apm/apmTalent/list/front',
        overview: 'apm/apmTalent/overview/front'
    },
    filterConfigForPage,
    pageTitle: '专家人才',
    searchTitle: '专家人才',
    showBanner: true,
    listPageisPadding: false,
    requiredRoles: ['all'],
    initialPageSize: initialPageSize
})

function viewDetails({ id }) {
    router.push(`/demands/TalentDetailPage/${id}`);
};

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
.industry-Talent-page {
    min-height: 500px;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
.pagination-wrapper{
  text-align: right;
  margin-bottom: @spacing-lg;
}
</style>