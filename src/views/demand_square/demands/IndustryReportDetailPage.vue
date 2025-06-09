<template>
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

async function fetchReportDetail() {
  if (!props.IdProp) return;
  isLoading.value = true;
  error.value = null;
  try {
    // TODO: API 调用 - 获取报告详情
    const response = await defHttp.get({ url: 'apm/apmResearchReport/queryById/front', params: { id: props.IdProp } });
    reportData.value = response.result;

    // reportData.value = {
    //   id: props.IdProp,
    //   title: `行研报告 > 一维/二维MOO2-ZNIN2S4异质结的构筑与光催化活性研究 - ${props.IdProp}`,
    //   domain: '光催化材料, 异质结',
    //   reportNumber: `A00000-${props.IdProp.slice(-4)}`,
    //   publishDate: '2024-05-15',
    //   summary: '直接利用太阳能实现光催化还原制取氢气，是解决能源危机的有效策略之一。过渡金属硫化物具有优异的可见光谱利用率和适宜的能级带结构，使其成为研究热点，然而，过高的充电速率极大地制约了它的应用。',
    //   price: 198,
    //   fullContentHtml: `
    //     <h2>1. 引言</h2>
    //     <p>光催化技术作为一种环境友好型能源转换技术，在解决能源危机和环境污染问题方面展现出巨大潜力。其中，利用半导体光催化剂在光照下分解水制氢是实现太阳能向化学能转化的重要途径...</p>
    //     <p><img src="https://via.placeholder.com/600x300/cccccc/969696.png?text=示意图1：反应机理" alt="示意图1"></p>
    //     <h2>2. MOO2-ZNIN2S4异质结的构筑</h2>
    //     <p>为了克服单一材料光催化剂的局限性，构建异质结成为提高光催化效率的有效策略。本研究采用水热法成功合成了二维MOO2纳米片，并通过原位生长法将其与一维ZNIN2S4纳米棒复合，形成了具有紧密界面接触的一维/二维MOO2-ZNIN2S4异质结光催化剂...</p>
    //     <h3>2.1 材料制备</h3>
    //     <p>详细的材料制备步骤如下...</p>
    //     <h2>3. 光催化性能测试与表征</h2>
    //     <p>通过XRD、SEM、TEM、XPS等多种表征手段对所制备样品的形貌、结构及元素组成进行了分析。光催化产氢实验结果表明...</p>
    //     <p><img src="https://via.placeholder.com/600x300/777777/eeeeee.png?text=示意图2：性能对比" alt="示意图2"></p>
    //     <h2>4. 结论</h2>
    //     <p>综上所述，本研究成功构筑了一维/二维MOO2-ZNIN2S4异质结，并通过系统的表征和性能测试，揭示了其优异的光催化产氢性能及其内在机理。这为设计高效、稳定的光催化剂提供了新的思路。</p>
    //   `,
    //   outline: [
    //     '一、锂离子电池行业定义',
    //     '二、锂离子电池行业发展背景',
    //     '三、上游产业介绍-原材料',
    //     '四、中游产业介绍-锂离子电池生产',
    //     '五、下游产业介绍-锂离子电池应用',
    //     '六、未来趋势'
    //   ],
    //   previousReport: { id: 'prev-001', title: '2023年中国集成电路产业运行情况' },
    //   nextReport: { id: 'next-002', title: '抢滩新能源赛道：六国化工加码投资电池级精制磷酸' },
    //   category: '光催化材料', // For recommended reports
    // };
    // --- End Mock Data ---
  } catch (err) {
    console.error("获取报告详情失败:", err);
    error.value = err.message || "加载报告详情失败，请稍后再试。";
    reportData.value = null;
  } finally {
    isLoading.value = false;
  }
}

const goBack = () => {
  router.push('/reports'); // 或者 router.go(-1)
};

onMounted(() => {
  fetchReportDetail();
});

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