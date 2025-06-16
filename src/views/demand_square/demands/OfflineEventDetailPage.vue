<template>
  <!-- 1. Page Title: "线下活动" -->
  <div class="page-title-header container">
    <span class="title-decorator-bar"></span>
    <h2 class="page-main-heading">线下活动</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <div class="event-detail-content-main" v-if="!isRegisterSuccess">
        <div v-if="isLoadingEvent && !eventDetail" class="loading-placeholder">
          <a-spin size="large" tip="活动详情加载中..." />
        </div>
        <div v-else-if="!eventDetail && !isLoadingEvent" class="error-placeholder">
          <a-empty description="无法加载活动详情，或活动不存在。" />
        </div>
        <div v-else class="event-details-loaded">

          <!-- 2. Event Banner -->
          <div class="event-banner-full-width">
            <img :src="eventDetail.bannerUrl || defaultBanner" :alt="eventDetail.title"
              class="event-banner-image-actual" />
          </div>

          <!-- 3. Event Main Title -->
          <h1 class="event-display-title">{{ eventDetail.activityName }}</h1>

          <!-- 4. Meta Info (Stacked) -->
          <div class="event-meta-stacked">
            <div class="meta-item-row">
              <span class="meta-label">会议时间：</span>
              <span class="meta-value">{{ eventDetail.activityDate }}</span>
            </div>
            <div class="meta-item-row">
              <span class="meta-label">会议类型：</span>
              <span class="meta-value">{{ eventDetail.activityTypeName }}</span>
            </div>
            <div class="meta-item-row">
              <span class="meta-label">会议状态：</span>
              <span class="meta-value status-text" :class="`status-${eventDetail.statusName}`">
                {{ eventDetail.statusName }}
              </span>
            </div>
          </div>

          <!-- 5. Event Main Content / Description -->
          <section class="event-section-block">
            <div class="section-block-title">会议主要内容：</div>
            <div class="section-block-content rich-text" v-html="eventDetail.description"></div>
          </section>

          <!-- 6. Participants -->
          <section class="event-section-block" v-if="eventDetail.participantsInfo">
            <h3 class="section-block-title">参与者：</h3>
            <div class="section-block-content participants-text">
              <!-- Assuming participantsInfo is a string that might need pre-formatting or just display as is -->
              <p v-for="(line, index) in formattedParticipants" :key="index">{{ line }}</p>
            </div>
          </section>

          <!-- 7. Action Button -->
          <div class="event-action-center">
            <a-button type="primary" danger size="large" class="main-action-cta-button" @click="handleActionClick">
              {{ eventDetail.actionButtonText || '一键敲门' }}
            </a-button>
            <p class="action-cta-note">一键敲门后，客服人员将在<span class="text">30分钟内</span>与您联系</p>
          </div>

        </div>
      </div>
      <operationResultPage v-else @primaryAction="handleToDetail" @secondaryAction="handleToList" />
    </template>

    <template #sidebar>
      <RelatedItemsSidebar title="其他线下活动" :items="relatedEvents" :is-loading="isLoadingRelated"
        empty-description="暂无其他活动推荐" @item-click="navigateToRelatedEvent" />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button as AButton, Spin as ASpin, Empty as AEmpty, message } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RelatedItemsSidebar from '@/components/common/RelatedItemsSidebar.vue'; // Adjust path if needed
import defaultEventBannerPlaceholder from '@/assets/images/home/banner.png'; // Ensure this placeholder exists
import operationResultPage from '@/components/template/operationResultPage.vue';
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();
const defaultBanner = defaultEventBannerPlaceholder;

const eventDetail = ref(null);
const isLoadingEvent = ref(true);
const relatedEvents = ref([]);
const isLoadingRelated = ref(false);
const isRegisterSuccess = ref(false);
const eventId = computed(() => route.params.id || 'mock-event-1'); // Get ID from route params

// --- Mock API Calls (Replace with actual API calls) ---
async function fetchEventDetail(id) {
  isLoadingEvent.value = true;
  eventDetail.value = null;
  const res = await defHttp.get({ url: `/apm/apmOfflineActivity/queryById/front`, params: { id } });
  isLoadingEvent.value = false;
  if (res.success) {
    eventDetail.value = res.result
  } else {
    message.error(res.message)
  }
}

async function fetchRelatedEvents() {
  isLoadingRelated.value = true;
  // ... (fetch logic as before) ...
  console.log('[MOCK API] Fetching related events...');
  await new Promise(resolve => setTimeout(resolve, 500));
  relatedEvents.value = [{ id: 'related-evt-1', title: '线下活动标题线下活动标题...', summary: '会议主要内容：直接利用太阳能实现光催化还原制取氢气，是解决能源危机的有效策略之一...', date: '2025/6/28' }, { id: 'related-evt-2', title: '另一相关活动标题示例', summary: '探讨行业最新动态与未来趋势，汇聚顶尖专家学者，分享前沿研究成果，促进产学研深度合作。', date: '2025/7/15' }, { id: 'related-evt-3', title: '第三个活动标题也很吸引人', summary: '聚焦关键技术突破，展示创新应用案例。本活动旨在为参与者提供一个交流思想、拓展人脉的平台。', date: '2025/8/02' }, { id: 'related-evt-4', title: '更多精彩活动敬请期待', summary: '探索未来科技，把握发展机遇。我们诚邀您参与，共同见证行业的辉煌未来，携手共创美好明天。', date: '2025/9/10' },];
  isLoadingRelated.value = false;
}
// --- End Mock API Calls ---

const formattedParticipants = computed(() => {
  if (eventDetail.value?.participantsInfo) {
    // Split by semicolon and trim whitespace from each part
    return eventDetail.value.participantsInfo.split('；').map(line => line.trim()).filter(line => line);
  }
  return [];
});

const handleActionClick = async () => {
  const response = await defHttp.post({ url: `/apm/apmOfflineActivity/registerByMemeber/${eventDetail.value?.id}` });
  if (response && response.success) {
    isRegisterSuccess.value = true;
  }
};

const navigateToRelatedEvent = (relatedItem) => {
  if (relatedItem.id && relatedItem.id !== eventId.value) {
    router.push({ name: 'EventDetail', params: { id: relatedItem.id } });
  }
};
const handleToDetail = () => {
  isRegisterSuccess.value = false;
}
const handleToList = () => {
  router.push({ path: '/demands/OfflineEvent' });
}

onMounted(() => {
  fetchEventDetail(eventId.value);
  fetchRelatedEvents();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchEventDetail(newId);
    // Optionally refresh related events if they should change based on the current event
    // fetchRelatedEvents();
  }
}, { immediate: false }); // immediate is false as onMounted handles initial load
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.event-detail-content-main {
  padding: @spacing-md;
  background-color: #fff;
  // This is the main white content block from ContentWithSidebarLayout
}

.event-banner-full-width {
  width: 100%;
  height: 300px; // Adjust banner height to match image ratio if possible
  margin-bottom: @spacing-lg;
  background-color: #e9ecef; // Placeholder color if image is missing
  overflow: hidden; // No rounded corners

  .event-banner-image-actual {
    width: 100%;
    height: 100%;
    object-fit: cover; // Ensure image covers the area
  }
}

.event-display-title {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 22px;
  line-height: 22px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #656C74;
  margin-bottom: @spacing-sm;
  text-align: left; // Default, but explicit
}

.event-meta-stacked {
  // margin-bottom: @spacing-xl; // Space below meta info
  // padding-bottom: @spacing-lg;
  // border-bottom: 1px solid @border-color-light; // Separator line

  .meta-item-row {
    display: flex; // Label and value on the same line
    font-size: 14px;
    line-height: 1.8; // More line height for readability
    margin-bottom: @spacing-xs; // Small space between meta rows

    .meta-label {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      text-align: justify;
      color: #656C74; // Gray label
      margin-right: @spacing-xs;
      white-space: nowrap; // Prevent label from wrapping
    }

    .meta-value {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      text-align: justify;
      color: #000000; // Darker value
    }

    .status-text {
      // Add classes like .status-preparing, .status-ongoing if you want to color code
      // e.g. &.status-ongoing { color: green; }
    }
  }
}

.event-section-block {
  margin-bottom: @spacing-xl;

  .section-block-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: justify;
    color: #656C74; // Gray label
    margin-bottom: @spacing-sm; // Space between title and content
  }

  .section-block-content {
    font-size: 14px; // Default content text size
    line-height: 1.7;
    color: @text-color-secondary; // Default content text color

    &.rich-text {
      // For v-html content like description
      color: #333333; // Match image's slightly darker paragraph text

      :deep(p) {
        margin-bottom: 0.8em; // Space between paragraphs

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &.participants-text {
      color: #666666; // Match image's participant text color

      // Styles for <p> tags generated by v-for="line in formattedParticipants"
      p {
        margin-bottom: 3px; // Small space between participant lines

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.event-action-center {
  text-align: right; // Center the button and note
  margin-top: @spacing-xxl; // More space above the button
  padding-top: @spacing-lg; // Padding above button if there was a border
  // No border-top as per the image

  .main-action-cta-button {
    background-color: @primary-color; // Red button
    border-color: @primary-color;
    min-width: 150px; // Button width
    height: 40px;
    font-size: 16px;

    // AntD primary danger button should give red color
    // If not, explicitly set:
    // background-color: #D9001B; (a common antd red)
    // border-color: #D9001B;
    &:hover {
      // background-color: darken(#D9001B, 5%);
      // border-color: darken(#D9001B, 5%);
    }
  }

  .action-cta-note {
    font-size: 12px; // Smaller note text
    color: @text-color-tertiary; // Light gray for note
    margin-top: @spacing-sm;
  }
}

.loading-placeholder,
.error-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}
</style>