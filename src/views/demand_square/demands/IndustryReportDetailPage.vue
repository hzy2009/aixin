<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">行研报告</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <IndustryReportDetailContent :report="reportData" />
    </template>
    <template #sidebar>
      <RecommendedSidebar :current-report-id="IdProp" :category="reportData?.category" :count="3" />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Skeleton as ASkeleton, Result as AResult, Button as AButton, Empty as AEmpty } from 'ant-design-vue';
import IndustryReportDetailContent from './components/IndustryReportDetailContent.vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RecommendedSidebar from './components/RecommendedSidebar.vue';
import defHttp from '@/utils/http/axios'

const route = useRoute();
const router = useRouter();

const props = defineProps({
  IdProp: { type: String, default: null },
});
const reportData = ref({});
const isLoading = ref(false);
const error = ref(null);

const internalDemandId = ref(props.IdProp);

async function fetchReportDetail() {
  if (!props.IdProp) return;
  isLoading.value = true;
  error.value = null;
  try {
    // TODO: API 调用 - 获取报告详情
    const response = await defHttp.get({ url: 'apm/apmResearchReport/queryById/front', params: { id: internalDemandId.value } });
    reportData.value = response.result;

  } catch (err) {
    console.error("获取报告详情失败:", err);
    error.value = err.message || "加载报告详情失败，请稍后再试。";
    reportData.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchReportDetail();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    internalDemandId.value = newId;
    fetchReportDetail();
    // Hot news usually doesn't need to refresh based on current article, but can if logic requires
    // fetchHotNews();
  }
}, { immediate: false }); // onMounted handles initial load
// 如果路由ID变化（例如用户直接修改URL或从推荐报告点击），重新加载数据
watch(() => route.params.id, (newId) => {
  if (newId && newId !== props.IdProp) {
    props.IdProp = newId;
    fetchReportDetail();
  }
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-report-detail-page {
  background-color: @background-color-light-gray; // 整个页面的背景色
  padding-bottom: @spacing-xxl;
}

.page-hero-banner {
  width: 100%;
  height: 280px; // Banner 高度，根据设计调整
  overflow: hidden;
  margin-bottom: @spacing-lg; // Banner 和下方内容的间距

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.page-content-layout {
  display: flex;
  gap: @spacing-lg; // 主内容和侧边栏的间距
  align-items: flex-start; // 确保侧边栏和主内容顶部对齐
}

.main-column {
  flex: 1; // 主内容区域占据剩余空间
  min-width: 0; // 防止内容过多时撑开布局
}

.sidebar-column {
  width: 320px; // 侧边栏固定宽度，根据设计调整
  flex-shrink: 0; // 防止侧边栏被压缩
}

.loading-main-content {
  background-color: @background-color-base;
  padding: @spacing-xl;
  border: 1px solid @border-color-light;

  .ant-skeleton {
    margin-bottom: @spacing-xl;
  }
}
</style>