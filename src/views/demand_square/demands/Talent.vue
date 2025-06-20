<template>
    <div class="industry-Talent-page">
        <listPage :pageData="pageData">
            <template #content="{ dataSource, paginationConfig }">
                <div class="results-grid content-section">
                    <TalentProfileCard v-for="item in dataSource" :key="item.id" :talent="item" @handleDetail="viewDetails"/>
                </div>
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
import TalentProfileCard from './components/TalentProfileCard.vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'skillAreaCode', label: '研究领域', maxVisibleWithoutMore: 7, dictKey: 'skill_area' },
]);

const pageData = ref({
    url: {
        list: 'apm/apmTalent/list/front',
        overview: 'apm/apmTalent/overview/front'
    },
    filterConfigForPage,
    pageTitle: '行业人才',
    showBanner: true,
    listPageisPadding: false
})

function viewDetails({ id }) {
    router.push(`/demands/TalentDetailPage/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/DomesticSourcing/create`);
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