<template>
  <div class="industry-report-item" @click="viewReportDetails(report.id)">
    <div class="report-item__date-badge">
      <div class="date-month-day">{{ formatDate(report.updateTime, 'MM/DD') }}</div>
      <div class="date-year">{{ formatDate(report.updateTime, 'YYYY') }}</div>
    </div>
    <div class="report-item__image-container">
      <img :src="getImgUrl(report.imageUrl)" :alt="report.title"
        class="report-image" />
    </div>
    <div class="report-item__content">
      <!-- <div class="content-header"> -->
      <!-- <a-tag v-if="report.reportTag" class="category-tag">{{ report.reportTag }}</a-tag> -->
      <!-- </div> -->
      <p class="report-title">{{ report.reportName }}</p>
      <!-- <p v-if="report.author" class="report-author">作者：{{ report.author }}</p> -->
      <p class="report-number">报告编号：{{ report.code }}</p>
      <p class="report-number report-summary"><span>摘要：</span></p>
      <p class="report-description-short" v-html="report.description"></p>
    </div>
    <div class="report-item__actions">
      <!-- <span class="report-views"><EyeOutlined /> {{ report.views || 0 }}</span> -->
      <ArrowRightOutlined class="details-arrow" />
    </div>
  </div>
</template>

<script setup>
import { EyeOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import defaultThumbnailPlaceholder from '@/assets/images/fallback/bannerreport.jpg'; // Create a placeholder
import { getFileAccessHttpUrl } from '@/utils/index';

const props = defineProps({
  report: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '2024年中国半导体制造业发展报告',
      author: '张明',
      description: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
      category: '半导体技术',
      publishDate: '2025-04-22',
      thumbnailUrl: null, // Will use placeholder if null
      views: 86,
    })
  }
});

const router = useRouter();
const defaultThumbnail = defaultThumbnailPlaceholder;

const formatDate = (dateString, format) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (format === 'MM/DD') {
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    }
    if (format === 'YYYY') {
      return date.getFullYear().toString();
    }
    return date.toLocaleDateString(); // Default
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};
const baseImgUrl = import.meta.env.VITE_GLOB_DOMAIN_URL;
const getImgUrl = (url) => {
  if (url) {
    return getFileAccessHttpUrl(url);
  } else {
    return defaultThumbnail;
  }
}


const viewReportDetails = (id) => {
  // TODO: Navigate to the actual report detail page
  router.push(`/demands/IndustryReportDetailPage/${id}`); // Example route
  console.log('View report details:', id);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-report-item {
  display: flex;
  align-items: stretch; // Make sure all parts stretch to the same height if content varies
  background-color: @background-color-base;
  padding: 18px;
  border-radius: @border-radius-base;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .report-title {
      color: @primary-color;
    }

    .details-arrow {
      color: @primary-color;
      transform: translateX(3px);
    }
  }
}

.report-item__date-badge {
  // display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  // padding-right: @spacing-lg;
  // border-right: 1px solid @border-color-light;
  margin-right: 18px;
  flex-shrink: 0;

  .date-month-day {
    color: #999999;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 26px;
    line-height: 26px;
    letter-spacing: 0%;
    margin-bottom: 4px;
  }

  .date-year {
    color: #999999;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    letter-spacing: 0%;
  }
}

.report-item__image-container {
  width: 290px;
  height: 177px;
  margin-right: 18px;
  overflow: hidden;
  border-radius: @border-radius-sm;
  flex-shrink: 0;

  .report-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover .report-image {
    transform: scale(1.05);
  }
}

.report-item__content {
  flex-grow: 1;
  // display: flex;
  flex-direction: column;
  justify-content: center; // Vertically center content if not much text
  min-width: 0; // Important for flex item to allow text truncation

  .content-header {
    display: flex;
    align-items: center;
    margin-bottom: @spacing-xs;
  }

  .category-tag {
    font-size: 14px;
    padding: 1px 6px;
    border-radius: @border-radius-sm;
    background-color: fade(@primary-color, 10%);
    color: @primary-color;
    border: 1px solid fade(@primary-color, 30%);
    margin-right: @spacing-sm;
    flex-shrink: 0;
  }

  .report-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0%;
    margin-bottom: 10px;
    color: #656C74;
    line-height: 1.4;
    transition: color 0.3s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; // For single line truncation
    // For multi-line (e.g., 2 lines):
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    // white-space: normal;
  }

  .report-author {
    font-size: 13px;
    color: @text-color-secondary;
    margin-bottom: @spacing-sm;
  }

  .report-number {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: justify;
    margin-bottom: 10px;
    color: #656C74;
  }

  .report-description {
    font-size: 14px;
    color: @text-color-secondary;
    color: #656C74;
    line-height: 1.6;
    margin-bottom: 0;
    // Multi-line ellipsis
    display: -webkit-box;
    -webkit-line-clamp: 4; // Show 2 lines for description
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .report-summary{
    margin-bottom: 4px;
  }
  .report-description-short{
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height:22px;
    letter-spacing: 0%;
    text-align: justify;
    color: #656C74;
    height: 66px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; // Show 2 lines for description
    -webkit-box-orient: vertical;
  }
}

.report-item__actions {
  display: flex;
  // flex-direction: column;
  align-items: flex-end;
  justify-content: space-between; // Pushes views to top, arrow to bottom (relative to this column)
  margin-left: @spacing-lg;
  padding-left: @spacing-lg;
  // border-left: 1px solid @border-color-light;
  flex-shrink: 0;
  width: 80px; // Fixed width for actions column

  .report-views {
    font-size: 13px;
    color: @text-color-tertiary;

    .anticon-eye {
      margin-right: 4px;
    }
  }

  .details-arrow {
    font-size: 20px;
    color: @text-color-tertiary;
    transition: color 0.3s ease, transform 0.3s ease;
  }
}
</style>