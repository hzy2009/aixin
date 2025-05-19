<template>
  <div class="industry-dynamics-page">
    <IndustryDynamicsHero />

    <div class="main-content-area section-padding container">
      <SectionHeader title-ch="行业动态" title-en="INDUSTRY TRENDS" :more-link="null" />

      <div class="content-layout">
        <div class="articles-column">
          <ArticleListItem
            v-for="article in paginatedArticles"
            :key="article.id"
            :article="article"
          />
          <div class="pagination-wrapper">
            <a-pagination
              v-model:current="currentPage"
              :total="totalArticles"
              :page-size="pageSize"
              show-less-items
              @change="handlePageChange"
            />
            <!-- Custom pagination elements as per design -->
            <span class="total-records">共 {{ totalArticles }} 条</span>
            <span class="jump-to">
              跳转至
              <a-input-number
                v-model:value="jumpToPage"
                size="small"
                :min="1"
                :max="totalPages"
                @pressEnter="handleJumpToPage"
                class="jump-input"
              />
              页
            </span>
          </div>
        </div>

        <div class="sidebar-column">
          <HotDynamicsSidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Pagination as APagination, InputNumber as AInputNumber } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import IndustryDynamicsHero from '../components/IndustryDynamicsHero.vue';
import ArticleListItem from '../components/ArticleListItem.vue';
import HotDynamicsSidebar from '../components/HotDynamicsSidebar.vue';

// Mock Data for main articles
const allArticles = ref([]);
const totalArticles = ref(0);
const currentPage = ref(1);
const pageSize = ref(5); // Number of articles per page
const jumpToPage = ref(1);

// Generate more mock data
const generateMockArticles = (count) => {
  const articles = [];
  for (let i = 1; i <= count; i++) {
    articles.push({
      id: i,
      image: `/src/assets/images/industryDynamics/article-thumb-${(i % 3) + 1}.jpg`, // Cycle through 3 thumb images
      title: `中国半导体企业加速技术突围 - 第${i}篇动态新闻标题示例`,
      description: `人民财讯5月${11 + (i % 10)}日电，近日，中国第三代半导体领军企业英诺赛科(02577.HK) 在与国际芯片巨头艾美飞凌的专利诉讼管辖权争议中取得关键胜利，这是描述内容第 ${i} 条。最高人民法院终审裁定，驳回艾美飞凌中国公司及无锡公司提出的管辖权异议上诉，确认苏州市中级人民法院对案件的管辖权。`,
      date: `2025/3/${(i % 28) + 1}`,
      link: `/industry-dynamics/${i}`
    });
  }
  return articles;
};

onMounted(() => {
  // Simulate fetching data
  const mockData = generateMockArticles(40); // Generate 40 articles
  allArticles.value = mockData;
  totalArticles.value = mockData.length;
});


const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allArticles.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(totalArticles.value / pageSize.value));

const handlePageChange = (page) => {
  currentPage.value = page;
  jumpToPage.value = page;
  // In a real app, you might fetch data for the new page here
};

const handleJumpToPage = () => {
  if (jumpToPage.value >= 1 && jumpToPage.value <= totalPages.value) {
    currentPage.value = jumpToPage.value;
  } else {
    // Reset jumpToPage if out of bounds, or show an error
    jumpToPage.value = currentPage.value;
  }
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-dynamics-page {
  background-color: @background-color-section-alt; // Overall page background for content area
}

.section-padding { // Reusable class for consistent section padding
  padding-top: @spacing-xxl;
  padding-bottom: @spacing-xxl;
}

.content-layout {
  display: grid;
  grid-template-columns: 3fr 1fr; // Adjust ratio as needed (e.g., 70% / 30%)
  gap: 24px;

  @media (max-width: 991px) { // Tablet and below, stack them
    grid-template-columns: 1fr;
  }
}

.articles-column {
  background-color: @background-color-base;
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  border: 1px solid @border-color-light;
  // If ArticleListItem has a fixed width, this column might not need to be flexible
  // or you might set its width explicitly to accommodate the fixed-width children + padding.
  // For example, if you want some padding around the 792px items:
  // width: (792px + @spacing-lg * 2);
  // Or, if the grid column itself is responsible for the width, ensure it's at least 792px + padding.
}

.sidebar-column {
  // Styles for the right sidebar column
  // HotDynamicsSidebar component handles its own background and padding
}

.pagination-wrapper {
  margin-top: @spacing-xl;
  display: flex;
  align-items: center;
  justify-content: flex-start; // Align to start as per design

  .total-records {
    margin-left: @spacing-xl;
    font-size: 14px;
    color: @text-color-secondary;
  }
  .jump-to {
    margin-left: @spacing-md;
    font-size: 14px;
    color: @text-color-secondary;
    display: flex;
    align-items: center;
    .jump-input {
      width: 50px;
      margin: 0 @spacing-xs;
      text-align: center;
    }
  }

  // Ant Design Pagination Customization
  :deep(.ant-pagination-item) {
    border-radius: @border-radius-sm;
    a {
      color: @text-color-secondary;
    }
    &:hover {
      border-color: @primary-color;
      a {
        color: @primary-color;
      }
    }
  }
  :deep(.ant-pagination-item-active) {
    background-color: @primary-color;
    border-color: @primary-color;
    a {
      color: @text-color-light;
    }
    &:hover a {
        color: @text-color-light;
    }
  }
  :deep(.ant-pagination-prev),
  :deep(.ant-pagination-next) {
    .ant-pagination-item-link {
      border-radius: @border-radius-sm;
      &:hover {
        color: @primary-color;
        border-color: @primary-color;
      }
    }
  }
  :deep(.ant-pagination-disabled) {
     .ant-pagination-item-link {
        &:hover {
            color: fade(@text-color-base, 25%); // AntD default disabled hover
            border-color: @border-color-base;
        }
     }
  }
}
</style>