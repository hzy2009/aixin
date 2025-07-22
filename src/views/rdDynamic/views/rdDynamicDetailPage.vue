<template>
  <div>
    <HomeHeroSection :height="160"/>
    <div class="page-title-header container" >
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">研发动态</h2>
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
              <span>
                <span v-if="formModel.categoryName" class="meta-category">{{ formModel.categoryName }}</span>
                <span class="meta-publish-time">发布时间：{{ formModel.createTime }}</span>
              </span>
              <span class="meta-source">研发成果来源：{{ formModel.source }}</span>
            </div>

            <div v-if="formModel.imageUrl" class="article-banner-image-container">
              <img :src="getImgUrl(formModel.imageUrl)" :alt="formModel.title" class="article-banner-img"/>
            </div>

            <div class="article-body-content rich-text-format" v-html="formModel.content">
            </div>
            <div class="article-action-bar">
              <a-button type="primary" danger @click="handleDefaultSubmit" class="action-button submit-button">联系平台获取专家信息</a-button>
              <p class="action-submit-note">一键敲门后，客服人员将在<span class="text">30分钟内</span>与您联系</p>
            </div>
            <div class="article-navigation-links">
              <div v-if="formModel.previous" class="nav-link-item prev-link">
                <router-link :to="`/industry-dynamics/${formModel.previous.id}`">
                  <span class="link-text">上一篇：</span>{{ formModel.previous.title }}
                </router-link>
              </div>
              <div v-if="formModel.next" class="nav-link-item next-link">
                <router-link :to="`/industry-dynamics/${formModel.next.id}`">
                  <span class="link-text">下一篇：</span>{{ formModel.next.title }}
                </router-link>
              </div>
            </div>
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
    <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息获取最新进展" actionText="联系平台获取最新进展"></PhoneAndEmailModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RelatedItemsSidebar from '@/components/common/RelatedItemsSidebar.vue'; // Adjust path if needed
import defaultNewsBannerPlaceholder from '@/assets/images/home/ddda.png'; // Create placeholder
import { useDemandDetail } from '@/components/template/hooks/useDemandDetail.js';
import { useUserDemandList } from '@/components/template/hooks/useUserDemandList.js'; // Adjust path
import { getFileAccessHttpUrl } from '@/utils/index';
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { useModalStore } from '@/store/modalStore'; 
import defHttp from '@/utils/http/axios'
const modalStore = useModalStore();

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});
const apiMap = {
  detail: '/apm/apmNewsForRd/queryById/front',
};
const phoneAndEmailModal = ref(null);
const {
	demandDetail: demandDetailData,
	isLoading,
	error,
	fetchDemandDetail,
  internalDemandId,
} = useDemandDetail({
	IdProp: props.id,
	url: apiMap,
});
const formModel = ref({});

const getImgUrl = (url) => {
  if (url) {
    return getFileAccessHttpUrl(url);
  } else {
    return defaultNewsBanner;
  }
}

const baseImgUrl = import.meta.env.VITE_GLOB_UPLOAD_URL;

const route = useRoute();
const router = useRouter();
const defaultNewsBanner = defaultNewsBannerPlaceholder;

const newsArticle = ref(null);

const articleId = computed(() => route.params.id || 'mock-news-1');


const {
    isLoading: isLoadingHotNews,
    tableData: hotNewsItems,          
} = useUserDemandList({
    url: {
      list: '/apm/apmNewsForRd/list/front',
  },
});

const navigateToHotNews = (newsItem) => {
  router.push({ name: 'IndustryDynamicDetail', params: { id: newsItem.id } });
};
const handleDefaultSubmit = () => {
  phoneAndEmailModal.value.opneModal()
}
const handleFinish = async (data) => {
  const res = await defHttp.get({ url: `/apm/apmTodo/apmNewsForRd/newTodo/${currentItem.value.id}`, params: data });
  if (res.success) {
    const defaultConfig = {
      title: '一键敲门成功',
      message: '一键敲门后，客服人员将在30分钟内与您联系',
      contactInfo: { name: '陈靖玮', phone: '021-55698507', email: 'info-service@icshare.com' },
      buttonText: '返回首页',
      showButton: false,
      onAction: null, // Default onAction is handled in store to go home
    };
    modalStore.showSuccessPrompt({ ...defaultConfig });
    phoneAndEmailModal.value.handleClose()
  } else {
    message.info(res.message)
  }
}

// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
	formModel.value = newDetail ? JSON.parse(JSON.stringify(newDetail)) : {};
}, { deep: true, immediate: true });

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    internalDemandId.value = newId;
    fetchDemandDetail(newId);
    // Hot news usually doesn't need to refresh based on current article, but can if logic requires
    // fetchHotNews();
  }
}, { immediate: false }); // onMounted handles initial load
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.news-detail-main-content {
  // width: 794px;
  min-width: 600px;
  padding: @spacing-md;
  background-color: #fff;
  // This is the white block from ContentWithSidebarLayout's #main slot
}

.page-section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: @spacing-xl; // Space after "行业热点" title
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
  margin-bottom: @spacing-md; // Space after "行业热点" title
}

.article-meta-info-bar {
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: @spacing-lg; // Space between meta items
  color: #9AA0A3; // Gray color for meta text
  margin-bottom: @spacing-md; // 28px space to banner
  padding-bottom: @spacing-md;
  border-bottom: 1px solid @border-color-light; // Separator line below meta
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0%;

  .meta-category {
    // If it needs special styling, e.g., a badge-like look
    // padding: 2px 6px;
    // background-color: #f0f0f0;
    // border-radius: @border-radius-sm;
    // color: @text-color-secondary; // Same gray as other meta text
    margin-right: @spacing-md;
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
  font-size: 14px;
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
  margin-top: 65px;
  // padding-top: @spacing-lg;
  font-size: 14px;

  .nav-link-item {
    .link-text{
      color: @primary-color;
    }
    margin-bottom: @spacing-sm;
    a {
      color: #656C74;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 28px;
      letter-spacing: 0%;

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
    margin-bottom: 15px;
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
.rich-text-format{

}
.article-action-bar{
  text-align: right;
  // display: flex;
	// justify-content: flex-end;
	margin-top: @spacing-xl;
  .action-button{
    height: 42px;
    padding: 0 28px;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    border-radius: 4px;
    margin-right: 16px;
  }
}
</style>