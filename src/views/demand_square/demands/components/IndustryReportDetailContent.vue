<template>
  <div class="report-detail-content-wrapper" v-if="!isRegisterSuccess">
    <!-- Main Report Info Block (Image Left, Details Right) -->
    <div class="report-header-block">
      <div class="report-header__image-wrapper">
        <img :src="getImgUrl(report.imageUrl)" :alt="report.title" class="report-header-image" />
      </div>
      <div class="report-header__details">
        <h1 class="report-main-title-header">{{ report.reportName }}</h1>
        <div class="report-summary-header">
          <span class="summary-label">摘要：</span>
          <p class="summary-text">{{ report.description }}</p>
        </div>
        <div class="report-meta-info-header">
          <span>领域：{{ report.reportTypeName }}</span>
          <span>报告编号：{{ report.code || '未知字段' }}</span>
        </div>
        <div class="report-action-block">

          <div class="report-price-header">
            <p class="original-price">原价: {{ report.unitPrice }}元</p>
            <p class="member-price">会员价: {{ report.memberUnitPrice || 198 }}元</p>
            <p class="vip-price">VIP价: <span class="vip-price-value">{{ report.vipUnitPrice || 198 }}</span>元</p>
          </div>
          <a-button type="primary" danger @click="handlePurchase" :loading="isPurchasing"
            class="purchase-button-header">
            联系管理员购买
          </a-button>
        </div>
      </div>
    </div>

    <!-- Outline Section Below -->
    <div class="report-outline-section">
      <h3 class="outline-title">大纲/目录</h3>
      <div class="outline-list">
        {{ outline }}
      </div>
    </div>

    <!-- Full Content (If applicable and different from summary) -->
    <!-- <div v-if="report.fullContentHtml && showFullContent" class="report-body-content">
      <h3 class="body-title">报告正文</h3>
      <div v-html="report.fullContentHtml" class="report-text-full"></div>
    </div> -->


    <!-- Previous/Next Navigation Below -->
    <!-- <div class="report-navigation-footer">
      <p v-if="report.previousReport">
        上一篇：<router-link :to="`/reports/detail/${report.previousReport.id}`">{{ report.previousReport.title
        }}</router-link>
      </p>
      <p v-if="report.nextReport">
        下一篇：<router-link :to="`/reports/detail/${report.nextReport.id}`">{{ report.nextReport.title }}</router-link>
      </p>
    </div> -->
  </div>
  <operationResultPage v-else @primaryAction="handleToDetail" @secondaryAction="handleToList" />
</template>

<script setup>
import { ref, watch } from 'vue';
import operationResultPage from '@/components/template/operationResultPage.vue';
import defaultThumbnailPlaceholder from '@/assets/images/home/banner.png'; // Reusing placeholder
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { getFileAccessHttpUrl } from '@/utils/index';
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();

const props = defineProps({
  report: {
    type: Object,
    required: true,
    default: () => ({
    })
  },
  showFullContent: { // Prop to control if full HTML content is shown below outline
    type: Boolean,
    default: false // By default, don't show it to keep this component focused on the header part
  }
});

const isPurchasing = ref(false);
const defaultThumbnail = defaultThumbnailPlaceholder;
const isRegisterSuccess = ref(false);

const handlePurchase = async () => {
  if (authStore?.token) {
    // const user = authStore.userInfo;
    // const data = {
    //   buyerName: user.realname,
    //   buyerId: user.loginTenantId,
    //   reportId: props.report.id,
    // }
    const response = await defHttp.post({ url: `/apm/apmResearchReport/registerByMember/${props.report.id}` });
    if (response && response.success) {
      isRegisterSuccess.value = true;
    }
  } else {
    modalStore.showLogin();
  }
};

const handleToDetail = () => {
  isRegisterSuccess.value = false;
}
const handleToList = () => {
  router.push({ path: '/demands/IndustryReport' });
}
const getImgUrl = (url) => {
  if (url) {
    console.log('2', getFileAccessHttpUrl(url));
    return getFileAccessHttpUrl(url);
  } else {
    return defaultThumbnail;
  }
}
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

    &:hover {
      color: @primary-color;
    }
  }

  :deep(span.ant-breadcrumb-link:last-child) {
    // Last item (current page)
    color: @text-color-base;
  }
}



.report-header-block {
  display: flex;
  gap: @spacing-xl; // Space between image and details
  padding: @spacing-lg;
  background-color: @background-color-base; // White background for this block
  // border: 1px solid @border-color-light;
  margin-bottom: @spacing-xl; // Space before outline
}

.report-header__image-wrapper {
  width: 280px; // Width of the image in the design
  //height: 185px;
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
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
    // padding-top: @spacing-md; // Space above it
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-top: 1px dashed @border-color-light; // Dashed line above price/button

    .report-price-header {
      font-family: PingFang SC;
      text-transform: uppercase;
      font-weight: 400;

      .original-price {
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0%;
        text-align: justify;
        text-decoration: line-through;
        color: #272A30;
      }

      .member-price {
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        color: @primary-color;
      }

      .vip-price {
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        color: @primary-color;

        .vip-price-value {
          font-weight: 600;
          font-size: 38px;
          line-height: 30px;
          letter-spacing: 0%;
          text-transform: uppercase;
        }
      }
    }

    .purchase-button-header {
      margin-top: 40px;
      background-color: @primary-color;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      letter-spacing: 0%;
      text-transform: uppercase;
      padding: 0 28px; // Button padding
      height: 50px; // Button height
      width: 170px;
    }
  }
}

.report-outline-section {
  margin-bottom: @spacing-xxl;
  background-color: @background-color-base;
  padding: @spacing-lg;
  // border: 1px solid @border-color-light;

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

.report-body-content {
  // If you choose to show full content via this component
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

    :deep(h2) {
      font-size: 20px;
      margin-top: @spacing-lg;
      margin-bottom: @spacing-md;
      font-weight: 600;
    }

    :deep(h3) {
      font-size: 18px;
      margin-top: @spacing-md;
      margin-bottom: @spacing-sm;
      font-weight: 600;
    }

    :deep(p) {
      margin-bottom: @spacing-md;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: @spacing-md 0;
      border-radius: @border-radius-sm;
    }
  }
}


.report-navigation-footer {
  font-size: 14px;
  color: @text-color-secondary;
  line-height: 1.6;
  padding: @spacing-md;
  background-color: @background-color-base;
  // border: 1px solid @border-color-light;

  p {
    margin-bottom: @spacing-xs;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: @text-color-base; // Links are darker in this section

    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }
}
</style>