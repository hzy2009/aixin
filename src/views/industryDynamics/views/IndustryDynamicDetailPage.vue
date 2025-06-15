<template>
  <div>
    <div class="page-title-header container" >
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">行业动态</h2>
    </div>
    <ContentWithSidebarLayout>
      <template #main>
        <div class="news-detail-main-content">
          <div v-if="isLoading && !formModel" class="loading-placeholder">
            <a-spin size="large" tip="动态详情加载中..." />
          </div>
          <div v-else class="news-article-loaded">
            <h1 class="article-main-title">{{ formModel.title }}</h1>

            <div class="article-meta-info-bar">
              <span v-if="formModel.category" class="meta-category">{{ formModel.category }}</span>
              <span class="meta-publish-time">发布时间：{{ formModel.createTime }}</span>
              <span v-if="formModel.source" class="meta-source">新闻来源：{{ formModel.source }}</span>
            </div>

            <div v-if="formModel.imageUrl" class="article-banner-image-container">
              <img :src="`${baseImgUrl}/${formModel.imageUrl}` || defaultNewsBanner" :alt="formModel.title" class="article-banner-img"/>
            </div>

            <div class="article-body-content rich-text-format" >
              {{ formModel.content }}
            </div>

            <!-- <div class="article-navigation-links">
              <div v-if="formModel.previousArticle" class="nav-link-item prev-link">
                <router-link :to="{ name: 'IndustryNewsDetail', params: { id: formModel.previousArticle.id } }">
                  上一篇：{{ formModel.previousArticle.title }}
                </router-link>
              </div>
              <div v-if="formModel.nextArticle" class="nav-link-item next-link">
                <router-link :to="{ name: 'IndustryNewsDetail', params: { id: formModel.nextArticle.id } }">
                  下一篇：{{ formModel.nextArticle.title }}
                </router-link>
              </div>
            </div> -->
          </div>
        </div>
      </template>

      <template #sidebar>
        <RelatedItemsSidebar
          title="热门动态"
          :items="hotNewsItems"
          :is-loading="isLoadingHotNews"
          empty-description="暂无热门动态"
          @item-click="navigateToHotNews"
        />
      </template>
    </ContentWithSidebarLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RelatedItemsSidebar from '@/components/common/RelatedItemsSidebar.vue'; // Adjust path if needed
import defaultNewsBannerPlaceholder from '@/assets/images/home/banner.png'; // Create placeholder
import { useDemandDetail } from '@/components/template/hooks/useDemandDetail.js';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});
const apiMap = {
  detail: '/apm/apmNews/queryById',
};
const {
	demandDetail: demandDetailData,
	isLoading,
	error,
	fetchDemandDetail,
} = useDemandDetail({
	IdProp: props.id,
	url: apiMap,
});
const formModel = ref({});

console.log('props.id', demandDetailData);
console.log('props.id', formModel);


const baseImgUrl = import.meta.env.VITE_GLOB_DOMAIN_URL;

const route = useRoute();
const router = useRouter();
const defaultNewsBanner = defaultNewsBannerPlaceholder;

const newsArticle = ref(null);
const hotNewsItems = ref([]);
const isLoadingHotNews = ref(false);

const articleId = computed(() => route.params.id || 'mock-news-1');

async function fetchNewsDetail(id) {
  isLoading.value = true;
  newsArticle.value = null;
  console.log(`[MOCK API] Fetching news detail for ID: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 600));
  // TODO: Replace with actual API call: apiClient.get(`/api/news/${id}`)
  if (id === 'mock-news-1') {
    newsArticle.value = {
      id: 'mock-news-1',
      title: '英诺赛科专利诉讼管辖权胜诉 中国半导体企业加速技术突围',
      category: '战略政策',
      publishDateTime: '2025-06-03 14:02',
      source: 'www.xinsaohf.com',
      bannerUrl: null, // Uses defaultNewsBanner, or set a specific URL
      showDefaultBanner: true, // To explicitly show banner even if bannerUrl is null
      contentHtml: `
        <p>人民财讯5月11日电，近日，中国第三代半导体领军企业英诺赛科（02577.HK）在与国际芯片巨头英飞凌的专利诉讼管辖权争议中取得关键胜利，最高人民法院终审裁定，驳回英飞凌中国公司及无锡公司提出的管辖权异议上诉，确认苏州市中级人民法院对案件的管辖权。</p>
        <p>此次胜诉标志着英诺赛科在捍卫自主知识产权的法律战中迈出重要一步，随着国内半导体产业链自主化进程加速，以英诺赛科为代表的科技企业正通过技术创新与法律手段双轮驱动，推动中国在全球半导体竞争格局中占据更主动地位。这是继英诺赛科此前在与美国EPC公司的专利纠纷案取得终极胜利之后，再一次赢得与国际半导体巨头之间的对抗的阶段性胜利。人民财讯5月11日电，近日，中国第三代半导体领军企业英诺赛科（02577.HK）在与国际芯片巨头英飞凌的专利诉讼管辖权争议中取得关键胜利，最高人民法院终审裁定，驳回英飞凌中国公司及无锡公司提出的管辖权异议上诉，确认苏州市中级人民法院对案件的管辖权。</p>
        <p>此次胜诉标志着英诺赛科在捍卫自主知识产权的法律战中迈出重要一步，随着国内半导体产业链自主化进程加速，以英诺赛科为代表的科技企业正通过技术创新与法律手段双轮驱动，推动中国在全球半导体竞争格局中占据更主动地位。这是继英诺赛科此前在与美国EPC公司的专利纠纷案取得终极胜利之后，再一次赢得与国际半导体巨头之间的对抗的阶段性胜利。</p>
        <p>这是继英诺赛科此前在与美国EPC公司的专利纠纷案取得终极胜利之后，再一次赢得与国际半导体巨头之间的对抗的阶段性胜利。</p>
      `,
      previousArticle: { id: 'mock-news-prev', title: '2019年中国集成电路产业运行情况' },
      nextArticle: { id: 'mock-news-next', title: '抢滩新储能赛道 六国化工加码投资电池级精致磷酸' }
    };
  } else {
    console.error("News article not found for ID:", id);
  }
  isLoading.value = false;
}

async function fetchHotNews() {
  isLoadingHotNews.value = true;
  // Using the same mock data structure as RelatedItemsSidebar expects
  // TODO: Replace with actual API: apiClient.get('/api/news/hot', { params: { limit: 4 }})
  await new Promise(resolve => setTimeout(resolve, 400));
  hotNewsItems.value = [
    { id: 'hot-1', title: '中国半导体行业协会2025年环境、安全和健康国际研讨会2025年环境...', date: '2025-04-22' },
    { id: 'hot-2', title: '中国半导体行业协会2025年环境、安全和健康国际研讨会2025年环境...', date: '2025-04-22' },
    { id: 'hot-3', title: '中国半导体行业协会2025年环境、安全和健康国际研讨会2025年环境...', date: '2025-04-22' },
    { id: 'hot-4', title: '中国半导体行业协会2025年环境、安全和健康国际研讨会2025年环境...', date: '2025-04-22' },
  ];
  isLoadingHotNews.value = false;
}

const navigateToHotNews = (newsItem) => {
  if (newsItem.id && newsItem.id !== articleId.value) {
    router.push({ name: 'IndustryNewsDetail', params: { id: newsItem.id } });
  }
};

onMounted(() => {
  fetchNewsDetail(articleId.value);
  fetchHotNews();
});

// Watch for route param changes to reload data if user navigates between detail pages
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchNewsDetail(newId);
    // Hot news usually doesn't need to refresh based on current article, but can if logic requires
    // fetchHotNews();
  }
}, { immediate: false }); // onMounted handles initial load

// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
	formModel.value = newDetail ? JSON.parse(JSON.stringify(newDetail)) : {};
}, { deep: true, immediate: true });

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.news-detail-main-content {
  padding: @spacing-md;
  background-color: #fff;
  // This is the white block from ContentWithSidebarLayout's #main slot
}

.page-section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: @spacing-xl; // Space after "行业动态" title
  .title-red-accent-bar {
    width: 4px;
    height: 18px; // Matches image
    background-color: @primary-color;
    margin-right: @spacing-sm + 2px;
  }
  .page-title-text {
    font-size: 18px;
    font-weight: 500;
    color: @text-color-base;
    margin: 0;
  }
}

.article-main-title {
  color: #333333; // Dark black/gray
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 0%;
  margin-bottom: @spacing-md; // Space after "行业动态" title
}

.article-meta-info-bar {
  display: flex;
  align-items: center;
  gap: @spacing-lg; // Space between meta items
  color: #9AA0A3; // Gray color for meta text
  margin-bottom: @spacing-md; // 28px space to banner
  padding-bottom: @spacing-md;
  border-bottom: 1px solid @border-color-light; // Separator line below meta
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0%;

  .meta-category {
    // If it needs special styling, e.g., a badge-like look
    // padding: 2px 6px;
    // background-color: #f0f0f0;
    // border-radius: @border-radius-sm;
    color: @text-color-secondary; // Same gray as other meta text
  }
  .meta-publish-time {
    
  }
  .meta-source {}
}

.article-banner-image-container {
  width: 100%;
  height: auto; // Let image aspect ratio define height, or set fixed
  max-height: 400px; // Max height for banner
  margin-bottom: @spacing-md;
  background-color: #f0f0f0; // Fallback for image loading
  overflow: hidden; // No rounded corners

  .article-banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover; // Or 'contain' if aspect ratio must be preserved
  }
}

.article-body-content { // For v-html content
  // font-size: 16px; // Main article text size
  // line-height: 1.9; // Generous line height for readability
  color: #656C74; // Article text color
  margin-bottom: @spacing-xl;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  text-indent: 24px;
  letter-spacing: 0%;
  text-align: justify;

  :deep(p) {
    margin-bottom: 1.2em; // Space between paragraphs
    text-indent: 2em; // First line indent for paragraphs, common in Chinese articles
    &:first-child {
        // text-indent: 0; // Optional: no indent for the very first paragraph
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  // Add styles for other HTML elements (h2-h6, ul, ol, blockquote, img) if your rich text uses them
  :deep(img) { // Style images within the article content
      max-width: 100%;
      height: auto;
      display: block;
      margin: @spacing-md auto; // Center images with some margin
      border-radius: @border-radius-sm;
  }
}

.article-navigation-links {
  margin-top: @spacing-xl;
  padding-top: @spacing-lg;
  border-top: 1px solid @border-color-light;
  font-size: 14px;

  .nav-link-item {
    margin-bottom: @spacing-sm;
    a {
      color: @text-color-secondary;
      &:hover {
        color: @primary-color;
        text-decoration: underline;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.loading-placeholder, .error-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}
.page-title-header {
    display: flex;
    align-items: center;
    margin-bottom: @spacing-md;
    margin-top: @spacing-md;
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