<template>
  <div class="report-detail-content-wrapper" v-if="!isRegisterSuccess">
    <!-- Main Report Info Block (Image Left, Details Right) -->
    <div class="report-header-block">
      <div class="report-header__image-wrapper">
        <img :src="getImgUrl(report.imageUrl)" :alt="report.title" class="report-header-image" />
      </div>
      <div class="report-header__details">
        <h1 class="report-main-title-header">{{ report.reportName }}</h1>
        <div><span>报告来源：</span><span>{{ report.source }}</span></div>
        <div class="report-summary-header">
          <span class="summary-label">摘要：</span>
          <!-- <p class="summary-text">{{ report.description }}</p> -->
          <div class="summary-text" v-html="report.description"></div>
        </div>
        <div class="report-meta-info-header">
          <!-- <span>领域：{{ report.reportTypeName }}</span> -->
          <span>报告编号：<span class="report-code">{{ report.code || '未知字段' }}</span></span>
        </div>
        <div class="report-action-block">
          <div class="report-price-header">
            <p class="original-price">原价: {{ report.unitPrice }}元</p>
            <p class="member-price">会员价: {{ report.memberUnitPrice }}元</p>
            <div class="vip-price">
              <div>
                VIP会员价: <span class="vip-price-value">{{ report.vipUnitPrice }}</span>元
              </div>
              <div class="vip-price-tips"> (可分章节单独购买)</div>
            </div>
          </div>
          <a-button type="primary" danger @click="handlePurchase" :loading="isPurchasing"
            class="purchase-button-header">
            联系管理员购买
          </a-button>
        </div>
      </div>
    </div>

    <!-- Outline Section Below -->
    <section class="report-outline-section info-section">
      <div class="section-title-wrapper">
        <h3 class="section-title-text">大纲/目录</h3>
      </div>
      <div class="outline-list" v-html="report.outline">
      </div>
    </section>

    <!-- Full Content (If applicable and different from summary) -->
    <!-- <div v-if="report.fullContentHtml && showFullContent" class="report-body-content">
      <h3 class="body-title">报告正文</h3>
      <div v-html="report.fullContentHtml" class="report-text-full"></div>
    </div> -->


    <!-- Previous/Next Navigation Below -->
    <div class="report-navigation-footer">
      <p v-if="report.previous">
        <router-link :to="`/demands/IndustryReportDetailPage/${report.previous.id}`">
          <span class="link-text">上一篇：</span>
          <span class="link-reportName">{{ report.previous.reportName }}</span>
        </router-link>
      </p>
      <p v-if="report.next">
        <router-link :to="`/demands/IndustryReportDetailPage/${report.next.id}`">
          <span class="link-text">下一篇：</span>
          <span class="link-reportName">{{ report.next.reportName }}</span>
        </router-link>
      </p>
    </div>
  </div>
  <operationResultPage v-else @primaryAction="handleToDetail" @secondaryAction="handleToList" />
  <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="联系管理员购买" actionText="一键敲门"></PhoneAndEmailModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import operationResultPage from '@/components/template/operationResultPage.vue';
import defaultThumbnailPlaceholder from '@/assets/images/fallback/bannerreport.jpg'; // Reusing placeholder
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { getFileAccessHttpUrl } from '@/utils/index';
import { useRouter } from 'vue-router';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
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
const phoneAndEmailModal = ref()
const handlePurchase = async () => {
  if (authStore?.token) {
    phoneAndEmailModal.value.opneModal()
  } else {
    modalStore.showLogin();
  }
};

const handleFinish = async (data) => {
  const response = await defHttp.post({ url: `/apm/apmResearchReportDetail/newTodo/${props.report.id}`, params: data });
  if (response && response.success) {
    isRegisterSuccess.value = true;
    phoneAndEmailModal.value.handleClose()
  } else {
    message.error(response.message);
  }
}

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
defineExpose({
  handleToDetail
});
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
  gap: 20px; // Space between image and details
  padding: @spacing-lg;
  background-color: @background-color-base; // White background for this block
  // border: 1px solid @border-color-light;
}

.report-header__image-wrapper {
  width: 328px;
  height: 340px;
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
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 22px;
    line-height: 30px;
    letter-spacing: 0%;
    text-transform: uppercase;
    min-height: calc(30px * 2); // Ensure space for 3 lines

    color: #656C74;
    margin-bottom: 8px;
    // For 2-line ellipsis if needed
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report-summary-header {
    margin-top: 16px;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.7;
    color: @text-color-secondary;
    height: 66px;
    display: -webkit-box; // For multi-line ellipsis
    -webkit-line-clamp: 3; // Show 3 lines for summary
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 66px; // Ensure space for 3 lines

    .summary-label {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      text-align: justify;
      color: #656C74; // Matches "领域" and "报告编号" color
      display: inline;
    }

    .summary-text {
      height: 66px;
      margin-bottom: 4px;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      letter-spacing: 0%;
      text-align: justify;
      color: #272A30;
      margin: 0;
      // Standard text, no extra styling needed unless different from paragraph default
      display: -webkit-box; // For multi-line ellipsis
      -webkit-line-clamp: 3; // Show 3 lines for summary
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 66px; // Ensure space for 3 lines
      display: inline;
      :deep(p) {
        display: inline;
      }
    }
  }

  .report-meta-info-header {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: justify;

    color: #656C74;
    margin-bottom: 18px; // Space above price/button block
    display: flex;
    flex-direction: column; // Stack domain and report number
    gap: 3px; // Small gap between domain and report number
  }

  .report-code {
    color: #272A30;
  }

  .report-action-block {
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
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 12px;
        letter-spacing: 0%;
        text-align: justify;
        text-decoration: line-through;
        color: #272A30;
        margin-bottom: 7px;
      }

      .member-price {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        text-transform: uppercase;
        color: @primary-color;
        margin-bottom: 10px;
      }

      .vip-price {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0%;
        text-transform: uppercase;
        margin-bottom: 0px;
        color: @primary-color;

        .vip-price-value {
          font-weight: 500;
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
  padding-bottom: @spacing-xl;
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
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background-color: @primary-color;
      position: absolute;
      bottom: -(@spacing-xs + 1px);
      left: 0;
      z-index: 1;
    }
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

.section-title-wrapper {
  margin-bottom: @spacing-md;
  padding-bottom: @spacing-xs;
  border-bottom: 1px solid @border-color-light;
  position: relative;

  .section-title-text {
    color: #656C74;
    margin: 0;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    letter-spacing: 0px;

    display: inline-block;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background-color: @primary-color;
      position: absolute;
      bottom: -10px;
      left: 0;
      z-index: 1;
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
  .link-text {
    color: @primary-color;
  }

  .link-reportName {
    color: #656C74;
  }

  color: #656C74;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0%;
  line-height: 1.6;
  padding: 24px;
  background-color: @background-color-base;
  // border: 1px solid @border-color-light;

  p {
    margin-bottom: @spacing-xs;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {

    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }
}

.vip-price-tips {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 12px;
  letter-spacing: 0%;
  text-align: justify;
  color: @primary-color;
  margin-top: 10px;
}
</style>