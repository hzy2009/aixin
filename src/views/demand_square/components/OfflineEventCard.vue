<template>
    <a-card :bordered="false" hoverable class="event-card" @click="viewEventDetails(event.id)">
      <template #cover>
        <div class="event-cover-image-wrapper">
          <img :alt="event.title" :src="event.bannerUrl || defaultEventBanner" class="event-cover-image" />
          <div v-if="event.organizerLogo" class="organizer-logo">
            <img :src="event.organizerLogo" alt="Organizer" />
          </div>
           <div v-else-if="event.organizerName" class="organizer-name-badge">
            {{ event.organizerName.substring(0, 10) }} <!-- Show short name if no logo -->
          </div>
        </div>
      </template>
  
      <div class="event-card-body">
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-meta">
          <a-tag v-if="event.eventType" class="event-type-tag">{{ event.eventType }}</a-tag>
          <span class="meta-item"><EnvironmentOutlined /> {{ event.location }}</span>
          <span class="meta-item"><CalendarOutlined /> {{ event.eventDate }}</span>
        </div>
        <div class="event-registration">
          <span class="reg-label">报名人数</span>
          <a-progress
            :percent="registrationPercent"
            :show-info="false"
            :stroke-color="primaryColor"
            trail-color="#e6e6e6"
            stroke-width="6"
            class="reg-progress"
          />
          <span class="reg-count">{{ event.registeredCount }}/{{ event.maxCapacity }}</span>
        </div>
      </div>
  
      <div class="event-card-footer">
        <div class="views-count">
          <EyeOutlined /> {{ event.views || 0 }}
        </div>
        <a-button type="primary" ghost class="details-btn">查看详情</a-button>
      </div>
    </a-card>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { Card as ACard, Tag as ATag, Progress as AProgress, Button as AButton } from 'ant-design-vue';
  import { EnvironmentOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import defaultEventBannerPlaceholder from '@/assets/images/home/banner.png'; // Create a placeholder
  import { theme } from 'ant-design-vue'; // To get theme variables
  
  const { useToken } = theme;
  const { token } = useToken();
  const primaryColor = token.value.colorPrimary;
  
  
  const props = defineProps({
    event: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        title: '2024年半导体制造工艺技术峰会',
        bannerUrl: null,
        organizerLogo: null, // e.g., '@/assets/images/events/future-logo.png'
        organizerName: '[Future]', // Fallback if no logo
        eventType: '技术研讨会',
        location: '华东',
        eventDate: '2024/6/18',
        registeredCount: 48,
        maxCapacity: 100,
        views: 86,
      })
    }
  });
  
  const router = useRouter();
  const defaultEventBanner = defaultEventBannerPlaceholder;
  
  const registrationPercent = computed(() => {
    if (props.event.maxCapacity > 0) {
      return Math.min(Math.round((props.event.registeredCount / props.event.maxCapacity) * 100), 100);
    }
    return 0;
  });
  
  const viewEventDetails = (id) => {
    // TODO: Navigate to actual event detail page
    router.push(`/events/detail/${id}`); // Example route
    console.log('View event details:', id);
  };
  </script>
  
  <style scoped lang="less">
  @import '@/assets/styles/_variables.less';
  
  .event-card {
    border-radius: @border-radius-base;
    overflow: hidden; // Important for cover image and overall card shape
    display: flex;
    flex-direction: column;
    height: 100%; // Ensure cards in a grid have same height
    cursor: pointer;
    border: 1px solid @border-color-light;
  
    &:hover {
      border-color: @primary-color;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      .event-cover-image {
          transform: scale(1.03);
      }
    }
  
    :deep(.ant-card-cover) {
      height: 180px; // Fixed height for the event banner
      overflow: hidden;
      position: relative; // For organizer logo positioning
    }
    .event-cover-image-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .event-cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease-in-out;
    }
    .organizer-logo {
      position: absolute;
      top: @spacing-sm;
      left: @spacing-sm;
      background-color: rgba(255,255,255,0.8);
      padding: 3px;
      border-radius: @border-radius-sm;
      img {
        height: 20px; // Adjust as needed
        max-width: 80px;
        display: block;
      }
    }
    .organizer-name-badge {
      position: absolute;
      top: @spacing-sm;
      left: @spacing-sm;
      background-color: rgba(0,0,0,0.5);
      color: @text-color-light;
      font-size: 12px;
      padding: 3px 6px;
      border-radius: @border-radius-sm;
    }
  
  
    :deep(.ant-card-body) {
      padding: @spacing-md;
      flex-grow: 1; // Allows body to expand and push footer down
      display: flex;
      flex-direction: column;
    }
  }
  
  .event-card-body {
      flex-grow: 1; // Push footer down
  }
  
  .event-title {
    font-size: 17px;
    font-weight: 600;
    color: @text-color-base;
    margin-bottom: @spacing-sm;
    line-height: 1.4;
    // Ellipsis for 2 lines
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: calc(1.4em * 2); // Ensure space for two lines
  }
  
  .event-meta {
    display: flex;
    flex-wrap: wrap; // Allow tags/meta to wrap if space is tight
    gap: @spacing-sm @spacing-md; // row and column gap
    align-items: center;
    margin-bottom: @spacing-md;
    font-size: 13px;
    color: @text-color-secondary;
  
    .event-type-tag {
      font-size: 12px;
      border-radius: @border-radius-sm;
      // background-color: #e6f7ff;
      // color: #1890ff;
      // border-color: #91d5ff;
      background-color: fade(@primary-color, 10%);
      color: @primary-color;
      border: 1px solid fade(@primary-color, 30%);
      margin: 0; // Remove default AntD tag margin if any
    }
    .meta-item {
      display: inline-flex;
      align-items: center;
      .anticon {
        margin-right: 5px;
      }
    }
  }
  
  .event-registration {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: @text-color-secondary;
    margin-top: auto; // Push to bottom if event-card-body is flex column
  
    .reg-label {
      margin-right: @spacing-sm;
      white-space: nowrap;
    }
    .reg-progress {
      flex-grow: 1;
      margin-right: @spacing-sm;
      // :deep(.ant-progress-inner) {
      //     background-color: #f0f0f0; // Trail color
      // }
      // :deep(.ant-progress-bg) {
      //     background-color: @primary-color; // Active color
      //     height: 6px !important;
      // }
    }
    .reg-count {
      white-space: nowrap;
      font-weight: 500;
      color: @text-color-base;
    }
  }
  
  .event-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @spacing-md;
      border-top: 1px solid @border-color-light;
      margin-top: @spacing-md; // Add margin if not pushed by flex-grow in body
  
      .views-count {
          font-size: 13px;
          color: @text-color-tertiary;
          .anticon {
              margin-right: 4px;
          }
      }
      .details-btn {
          // Using primary ghost button
          padding: 3px 12px;
          height: auto;
          font-size: 13px;
      }
  }
  </style>