<template>
  <div class="industry-news-item" @click="navigateToDetail(news)">
    <div class="news-item-date-block">
      <span class="date-day-month">{{ formatDate(news.createTime, 'MM/DD') }}</span>
      <span class="date-year">{{ formatDate(news.createTime, 'YYYY') }}</span>
    </div>
    <div class="news-item-content">
      <h3 class="news-title">{{ news.title }}</h3>
      <p class="news-summary">{{ news.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  news: {
    type: Object,
    required: true,
    default: () => ({
    })
  }
});

const router = useRouter();

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
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

const navigateToDetail = ({id}) => {
  router.push({ name: 'IndustryDynamicDetail', params: { id } }); 
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-news-item {
  height: 150px;
  display: flex;
  padding: 22px 18px; // Vertical padding for each item
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: @spacing-lg;
  background: #fff;
  &:hover {
    // background-color: #f9f9f9; // Slight hover background
    .news-title {
      color: @primary-color;
    }
  }

  // &:first-child {
  //   padding-top: 0; // No top padding for the very first item in the list
  // }
  // &:last-child {
  //   border-bottom: none; // No bottom border for the very last item
  // }
}

.news-item-date-block {
  display: flex;
  flex-direction: column;
  text-align: left;
  // padding-right: @spacing-lg;
  flex-shrink: 0;
  width: 80px; // Fixed width for date block

  .date-day-month {
    color: #999999;
    font-family: PingFang SC;
    font-weight: 540;
    font-size: 26px;
    line-height: 26px;
    letter-spacing: 0%;
    margin-bottom: 5px;
  }
  .date-year {
    color: #999999;
    font-family: PingFang SC;
    font-size: 18px;
    line-height: 18px;
    letter-spacing: 0%;

  }
}

.news-item-content {
  flex-grow: 1;
  min-width: 0; // For text truncation to work
  padding-left: 10px;
  .news-title {
    color: #333333;
    margin-bottom: @spacing-md;
    transition: color 0.3s ease;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 22px;
    line-height: 22px;
    letter-spacing: 0%;

    // Optional: single line truncation for title if desired
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }

  .news-summary {
    color: #656C74;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: justify;

    margin: 0;
    // Multi-line ellipsis for summary
    display: -webkit-box;
    -webkit-line-clamp: 3; // Show 2 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-height: calc(1.7em * 2); // Ensure space for 2 lines if content varies
  }
}
</style>