<template>
  <div class="industry-dynamics-page">
    <HomeHeroSection :height="160"/>
    <div class="page-title-header container" >
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">定制开发动态</h2>
    </div>
    <ContentWithSidebarLayout>
      <template #main>
        <div class="industry-dynamics-main-content">
          <div v-if="isLoading && tableData.length === 0" class="list-loading-placeholder">
            <a-spin size="large" />
          </div>
          <div v-else-if="tableData.length > 0" class="news-list-container">
            <IndustryNewsItem
              v-for="newsItem in tableData"
              :key="newsItem.id"
              :news="newsItem"
            />
            <div class="pagination-wrapper">
              <a-pagination size="small" v-model:current="pagination.current" v-bind="pagination" :show-size-changer="false" show-quick-jumper  @change="handlePageChange" />
            </div>
          </div>
          <div v-else class="list-empty-placeholder">
            <a-empty description="暂无定制开发动态" />
          </div>
        </div>
      </template>

      <template #sidebar>
        <RelatedItemsSidebar
          title="热门动态"
          :items="tableData"
          :is-loading="isLoading"
          @itemClick="navigateToHotNewsDetail"
          empty-description="暂无热门动态"
        />
      </template>
    </ContentWithSidebarLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Spin as ASpin, Alert as AAlert, Empty as AEmpty, Pagination as APagination } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RelatedItemsSidebar from '@/components/common/RelatedItemsSidebar.vue'; // Adjust path if needed
import IndustryNewsItem from '../components/IndustryNewsItem.vue'; // Adjust path
import defHttp from '@/utils/http/axios'
import { useUserDemandList } from '@/components/template/hooks/useUserDemandList.js'; // Adjust path
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';

const url = {
    list: '/apm/apmNewsForRd/list/front',
}
const pageSize = 5
const {
    isLoading,
    tableData,          
    pagination,       
    handleTablePaginationChange,
} = useUserDemandList({
    url: url,
    initialPageSize: pageSize
});
const handlePageChange = (page) => {
  const P = {
    current: page,
    pageSize: pageSize
  }
  handleTablePaginationChange(P);
}
const router = useRouter();

const navigateToHotNewsDetail = (newsItem) => {
  // TODO: Define your news detail route
  router.push({ name: 'IndustryDynamicDetail', params: { id: newsItem.id } });
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-dynamics-page{
  background-color: #f8f9fa;
}
.industry-dynamics-main-content {
  background-color:#f8f9fa;
}
.news-list-container {
  // IndustryNewsItem handles its own bottom border for separation
}

.list-loading-placeholder,
.list-error-placeholder,
.list-empty-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: @spacing-xl;
}
.pagination-wrapper {
  text-align: right;
  margin-bottom: @spacing-lg;
  margin-top: @spacing-xl;
   :deep(.ant-pagination-item-active) {
    background-color: @primary-color;
    border-color: @primary-color;
    a {
      color: white !important;
    }
  }
  :deep(.ant-pagination-item-active:hover) {
    background-color: darken(@primary-color, 10%);
    border-color: darken(@primary-color, 10%);
  }
   :deep(.ant-pagination-item:hover a){
      color: @primary-color;
   }
   :deep(.ant-pagination-prev:hover .ant-pagination-item-link),
   :deep(.ant-pagination-next:hover .ant-pagination-item-link) {
       color: @primary-color;
       border-color: @primary-color;
   }
    :deep(.ant-pagination-options-quick-jumper input:hover){
        border-color: @primary-color;
    }
    :deep(.ant-pagination-options-quick-jumper input:focus){
        border-color: @primary-color;
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    }
}
.page-title-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
    height: 28px;

    .title-decorator-bar {
        width: 4px;
        height: 28px;
        background-color: @primary-color;
        margin-right: @spacing-sm;
    }

    .page-main-heading {
        color: @primary-color;
        margin: 0;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 20px;
        line-height: 100%;
        letter-spacing: 0%;
        text-transform: uppercase;

    }
}
</style>