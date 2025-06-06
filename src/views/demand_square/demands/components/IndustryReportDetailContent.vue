<template>
  <div class="report-detail-content-wrapper">
    <!-- Section Title: "行研报告" with red bar -->
    <div class="page-section-title-bar">
      <span class="decorator"></span>
      <h2 class="title-text">行研报告</h2>
    </div>

    <!-- Main Report Info Block (Image Left, Details Right) -->
    <div class="report-header-block">
      <div class="report-header__image-wrapper">
        <img :src="report.thumbnailUrl || defaultThumbnail" :alt="report.title" class="report-header-image" />
      </div>
      <div class="report-header__details">
        <h1 class="report-main-title-header">{{ report.title }}</h1>
        <div class="report-summary-header">
          <span class="summary-label">摘要：</span>
          <p class="summary-text">{{ report.summary }}</p>
        </div>
        <div class="report-meta-info-header">
          <span>领域：{{ report.domain }}</span>
          <span>报告编号：{{ report.reportNumber }}</span>
        </div>
        <div class="report-action-block">
          <span class="report-price-header">¥ {{ report.price }}</span>
          <a-button type="primary" danger size="large" @click="handlePurchase" :loading="isPurchasing" class="purchase-button-header">
            联系管理员购买
          </a-button>
        </div>
      </div>
    </div>

    <!-- Outline Section Below -->
    <div class="report-outline-section">
      <h3 class="outline-title">大纲/目录</h3>
      <ul class="outline-list">
        <li v-for="(item, index) in report.outline" :key="index">{{ item }}</li>
      </ul>
    </div>

    <!-- Full Content (If applicable and different from summary) -->
    <div v-if="report.fullContentHtml && showFullContent" class="report-body-content">
        <h3 class="body-title">报告正文</h3>
        <div v-html="report.fullContentHtml" class="report-text-full"></div>
    </div>


    <!-- Previous/Next Navigation Below -->
    <div class="report-navigation-footer">
      <p v-if="report.previousReport">
        上一篇：<router-link :to="`/reports/detail/${report.previousReport.id}`">{{ report.previousReport.title }}</router-link>
      </p>
      <p v-if="report.nextReport">
        下一篇：<router-link :to="`/reports/detail/${report.nextReport.id}`">{{ report.nextReport.title }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem, Button as AButton } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import defaultThumbnailPlaceholder from '@/assets/images/home/banner.png'; // Reusing placeholder

const props = defineProps({
  report: {
    type: Object,
    required: true,
    default: () => ({
        title: '一维/二维MOO2-ZNIN2S4异质结的构筑与光催化活性研究',
        summary: '直接利用太阳能实现光催化还原制取氢气，是解决能源危机的有效策略之一。过渡金属硫化物具有优异的可见光谱利用率和适宜的能级带结构，使其成为研究热点，然而，过高的充电速率极大地制约了它的应用。',
        domain: '光催化分解水;异质结;过渡金属硫化物;领域名称;',
        reportNumber: 'A00000-0000',
        price: 198,
        thumbnailUrl: null, // Will use placeholder from import
        outline: [
            '一、锂离子电池行业定义',
            '二、锂离子电池行业发展背景',
            '三、上游产业介绍-原材料',
            '四、中游产业介绍-锂离子电池生产',
            '五、下游产业介绍-锂离子电池应用',
            '六、未来趋势'
        ],
        previousReport: { id: 'prev-001', title: '2023年中国集成电路产业运行情况' },
        nextReport: { id: 'next-002', title: '抢滩新能源赛道：六国化工加码投资电池级精制磷酸' },
        fullContentHtml: "<p>这里是报告的<strong>完整HTML</strong>内容...</p>", // Optional full content
    })
  },
  showFullContent: { // Prop to control if full HTML content is shown below outline
      type: Boolean,
      default: false // By default, don't show it to keep this component focused on the header part
  }
});

const isPurchasing = ref(false);
const defaultThumbnail = defaultThumbnailPlaceholder;

const handlePurchase = () => {
  isPurchasing.value = true;
  console.log("联系管理员购买报告:", props.report.id);
  message.info('已通知管理员，请等待联系，或直接致电客服。');
  setTimeout(() => {
    isPurchasing.value = false;
  }, 1500);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.report-detail-content-wrapper {
  // This component is now just the content, not the overall page shell with sidebar.
  // Background and border will be on its parent in IndustryReportDetailPage.vue
}

.page-global-breadcrumb {
  margin-bottom: @spacing-md; // Space below breadcrumb
  font-size: 13px;
  a {
    color: @text-color-secondary;
    &:hover { color: @primary-color; }
  }
  :deep(span.ant-breadcrumb-link:last-child) { // Last item (current page)
    color: @text-color-base;
  }
}

.page-section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: @spacing-lg; // Space after "行研报告" title
  .decorator {
    width: 4px;
    height: 20px;
    background-color: @primary-color;
    margin-right: @spacing-sm;
  }
  .title-text {
    font-size: 20px; // "行研报告" title size
    font-weight: 600;
    color: @text-color-base;
    margin: 0;
  }
}

.report-header-block {
  display: flex;
  gap: @spacing-xl; // Space between image and details
  padding: @spacing-lg;
  background-color: @background-color-base; // White background for this block
  border: 1px solid @border-color-light;
  margin-bottom: @spacing-xl; // Space before outline
}

.report-header__image-wrapper {
  width: 280px; // Width of the image in the design
  height: 185px; // Height of the image in the design
  flex-shrink: 0;
  overflow: hidden;
  // border-radius: @border-radius-sm; // If image has rounded corners

  .report-header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.report-header__details {
  flex-grow: 1;
  display: flex;
  flex-direction: column; // Stack title, summary, meta, action block vertically
  min-width: 0; // Important for flex children to shrink and allow text ellipsis

  .report-main-title-header {
    font-size: 22px; // Title size in the right column
    font-weight: 600;
    color: @text-color-base;
    margin-bottom: @spacing-sm;
    line-height: 1.4;
    // For 2-line ellipsis if needed
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  .report-summary-header {
    margin-bottom: @spacing-xs;
    font-size: 14px;
    line-height: 1.7;
    color: @text-color-secondary;

    .summary-label {
      font-weight: 500; // "摘要：" slightly bolder
      color: @text-color-base; // Matches "领域" and "报告编号" color
    }
    .summary-text {
      // Standard text, no extra styling needed unless different from paragraph default
      display: -webkit-box; // For multi-line ellipsis
      -webkit-line-clamp: 3; // Show 3 lines for summary
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: calc(1.7em * 3); // Ensure space for 3 lines
    }
  }

  .report-meta-info-header {
    font-size: 13px;
    color: @text-color-secondary;
    margin-bottom: @spacing-lg; // Space above price/button block
    display: flex;
    flex-direction: column; // Stack domain and report number
    gap: 3px; // Small gap between domain and report number
  }

  .report-action-block {
    margin-top: auto; // Pushes this block to the bottom of the flex column
    padding-top: @spacing-md; // Space above it
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed @border-color-light; // Dashed line above price/button

    .report-price-header {
      font-size: 28px;
      font-weight: bold;
      color: @primary-color;
      line-height: 1; // Ensure it aligns well with button
    }
    .purchase-button-header {
      font-size: 15px; // Button text size
      font-weight: 500;
      padding: 0 28px; // Button padding
      height: 40px; // Button height
      // AntD primary danger button already has red background
    }
  }
}

.report-outline-section {
  margin-bottom: @spacing-xxl;
  background-color: @background-color-base;
  padding: @spacing-lg;
  border: 1px solid @border-color-light;

  .outline-title {
    font-size: 16px; // "大纲/目录" title size
    font-weight: 500; // Design looks like normal or semi-bold
    color: @text-color-base;
    margin-bottom: @spacing-md;
    padding-bottom: @spacing-sm;
    border-bottom: 1px solid @border-color-light;
  }
  .outline-list {
    list-style: none;
    padding: 0;
    font-size: 14px;
    color: @text-color-secondary;
    li {
      padding: 6px 0; // Vertical padding for list items
      // border-bottom: 1px dotted #eee;
      // &:last-child { border-bottom: none; }
    }
  }
}

.report-body-content { // If you choose to show full content via this component
    margin-bottom: @spacing-xxl;
    background-color: @background-color-base;
    padding: @spacing-lg;
    border: 1px solid @border-color-light;
    .body-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: @spacing-lg;
        padding-bottom: @spacing-md;
        border-bottom: 1px solid @border-color-light;
    }
    .report-text-full {
      font-size: 15px;
      line-height: 1.8;
      color: @text-color-base;
      :deep(h2) { font-size: 20px; margin-top: @spacing-lg; margin-bottom: @spacing-md; font-weight: 600; }
      :deep(h3) { font-size: 18px; margin-top: @spacing-md; margin-bottom: @spacing-sm; font-weight: 600; }
      :deep(p) { margin-bottom: @spacing-md; }
      :deep(img) { max-width: 100%; height: auto; margin: @spacing-md 0; border-radius: @border-radius-sm; }
    }
}


.report-navigation-footer {
  font-size: 14px;
  color: @text-color-secondary;
  line-height: 1.6;
  padding: @spacing-md;
  background-color: @background-color-base;
  border: 1px solid @border-color-light;

  p { margin-bottom: @spacing-xs; &:last-child { margin-bottom: 0;}}
  a {
    color: @text-color-base; // Links are darker in this section
    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }
}
</style>