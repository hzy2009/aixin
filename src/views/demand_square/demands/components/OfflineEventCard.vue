<template>
  <a-card :bordered="true" hoverable class="event-card" @click="viewEventDetails(event)">
    <template #cover>
      <div class="event-cover-image-wrapper">
        <img :alt="event.activityName" :src="event.bannerUrl || defaultEventBanner" class="event-cover-image" />
        <div v-if="event.organizerName" class="organizer-badge">
          <span class="organizer-decorator"></span> {{ event.organizerName }}
        </div>
      </div>
    </template>

    <div class="event-card-content">
      <h3 class="event-title">{{ event.activityName }}</h3>
      <div class="event-meta">
        <a-tag v-if="event.activityTypeName" class="event-type-tag">{{ event.activityTypeName }}</a-tag>
        <div class="event-date"><CalendarOutlined /> {{ event.activityDate }}</div>
      </div>
    </div>

    <template #actions>
      <div class="event-card-action">
        <span @click.stop="viewEventDetails(event)">查看详情</span>
      </div>
    </template>
  </a-card>
</template>

<script setup>
import { Card as ACard, Tag as ATag } from 'ant-design-vue';
import { CalendarOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import defaultEventBannerPlaceholder from '@/assets/images/home/offline.png'; // 确保你有一个占位图

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => ({
      id: 'evt-001',
      title: '会议主题会议主题会议主题会议主题',
      bannerUrl: null, // 将使用占位图
      activityTypeCode: 'Future', // 主办方，例如图片中的 "Future"
      activityTypeName: '活动类型', // 例如 "技术研讨会"
      eventDate: '2024/6/18',
    })
  }
});
const emit = defineEmits(['handleDetails']);
const router = useRouter();
const defaultEventBanner = defaultEventBannerPlaceholder;

const viewEventDetails = (payLoad) => {
  // 阻止事件冒泡，以防父级 card 的 click 事件也触发（如果 action 本身也是可点击区域）
  // event.stopPropagation(); // 在这里不需要，因为 action 的 click 事件会处理导航
  // TODO: 导航到实际的活动详情页面
  // router.push(`/events/detail/${id}`); // 示例路由
  console.log('查看活动详情:', payLoad);
  emit('handleDetails', payLoad);

};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.event-card {
  border-radius: @border-radius-sm; // 图片中卡片边角非常柔和
  overflow: hidden;
  border: 1px solid @border-color-light; // 卡片有一个细边框
  box-shadow: none; // 图片中没有明显阴影，或者非常非常淡
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: @primary-color;
    // box-shadow: 0 4px 12px rgba(0,0,0,0.08); // 可选：悬停时轻微阴影
    .event-cover-image {
        transform: scale(1.03); // 图片轻微放大
    }
    .event-card-action span {
        color: @primary-color-dark; // 详情按钮文字颜色加深
        border-color: @primary-color-dark;
    }
  }

  // 覆盖层 (封面图片)
  :deep(.ant-card-cover) {
    height: 170px; // 根据图片比例调整，与设计稿匹配
    overflow: hidden;
    position: relative;
  }
  .event-cover-image-wrapper {
      width: 100%;
      height: 100%;
      position: relative; // 为了主办方徽标定位
  }
  .event-cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
  .organizer-badge {
    position: absolute;
    top: @spacing-sm + 2px; // 距离顶部
    left: @spacing-sm + 2px;  // 距离左侧
    background-color: rgba(0,0,0,0.4); // 半透明黑色背景
    color: @text-color-light;
    font-size: 12px;
    padding: 3px 8px 3px 6px; // 细微调整padding
    border-radius: @border-radius-sm;
    display: inline-flex; // 使其内容内联排列
    align-items: center;

    .organizer-decorator {
      display: inline-block;
      width: 3px;
      height: 10px; // 装饰条高度
      background-color: @primary-color; // 红色装饰条
      margin-right: 5px; // 与文字间距
    }
  }

  // 卡片主体内容区
  :deep(.ant-card-body) {
    padding: @spacing-md; // 主体内容的内边距
  }
}

.event-card-content {
  // 此区域用于放置标题、标签和日期
  // 如果需要固定高度，可以在这里设置，并处理内容溢出
}

.event-title {
  font-size: 16px; // 标题字体大小
  font-weight: 500; // 标题字重
  color: @text-color-base;
  margin-bottom: @spacing-xs; // 标题与下方元素的间距
  line-height: 1.4;
  // 单行省略号
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: @spacing-sm; // 与下方（或卡片底部，如果没actions）的间距
}

.event-meta {
  // display: flex;
  // justify-content: space-between; // 将标签和日期推向两端
  align-items: center;
  // margin-bottom: @spacing-md; // 与下方（或卡片底部，如果没actions）的间距
  font-size: 13px;
  color: @text-color-secondary;

  .event-type-tag {
    font-size: 12px;
    color: @text-color-secondary; // 标签文字颜色
    background-color: #f5f5f5; // 标签背景色
    border-color: @border-color-light; // 标签边框颜色
    border-radius: @border-radius-sm;
    padding: 1px 6px; // 标签内边距
    margin: 0; // 清除AntD Tag的默认外边距
    margin-bottom: @spacing-sm; // 与下方（或卡片底部，如果没actions）的间距
  }
  .event-date {
    align-items: center;
    .anticon-calendar {
      margin-right: 5px;
      color: @text-color-tertiary; // 日期图标颜色
    }
  }
}

// 卡片操作区（底部按钮）
:deep(.ant-card-actions) {
  padding: 0; // 清除AntD actions的默认padding
  border-top: 1px solid @border-color-light; // 分割线
  background-color: @background-color-base; // 确保背景色
  > li {
    margin: 0; // 清除AntD li的默认外边距
    text-align: right; // 使内容靠右
    padding: @spacing-sm @spacing-md; // 给操作项内边距

    > span { // 直接针对span，因为只有一个操作项
        width: auto; // 允许内容自适应宽度
        display: inline-block; // 使其像按钮一样
    }
  }
}

.event-card-action {
  display: flex; // 使用flex来方便对齐（如果未来有多个按钮）
  justify-content: flex-end; // 按钮靠右
  width: 100%; // 确保填满actions的li

  span { // “查看详情” 文本按钮样式
    font-size: 13px;
    color: @primary-color;
    border: 1px solid @primary-color;
    padding: 4px 12px;
    border-radius: @border-radius-sm;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s, background-color 0.3s;

    &:hover {
      color: @text-color-light;
      background-color: @primary-color;
      border-color: @primary-color;
    }
  }
}
</style>