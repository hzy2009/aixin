<template>
  <div class="hot-dynamics-sidebar">
    <h3 class="sidebar-title">热门动态</h3>
    <a-list item-layout="horizontal" :data-source="hotItems" :split="false" class="hot-items-list">
      <template #renderItem="{ item }">
        <a-list-item>
          <router-link :to="item.link" class="hot-item">
            <p class="hot-item__title">{{ item.title }}</p>
            <span class="hot-item__date">{{ item.date }}</span>
          </router-link>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { List as AList, ListItem as AListItem } from 'ant-design-vue';

// TODO: Fetch hotItems from an API
// const hotItems = ref([]);
// onMounted(async () => {
//   try {
//     // const response = await apiClient.get('/api/hot-dynamics');
//     // hotItems.value = response.data.map(item => ({ ...item, link: `/industry-dynamics/${item.id}`}));
//   } catch (error) {
//     console.error("Failed to fetch hot dynamics:", error);
//   }
// });

// Using Mock data for now
const hotItems = ref([
  { id: 101, title: '中国半导体行业协会2025年环境、安全和健康国际研讨会成功举办并发布重要行业倡议', date: '2025-04-22', link: '/industry-dynamics/101' },
  { id: 102, title: '探索下一代芯片技术：量子计算与半导体的融合机遇，行业巨头纷纷布局未来，抢占技术制高点', date: '2025-04-20', link: '/industry-dynamics/102' },
  { id: 103, title: '全球供应链重塑下的国产替代加速趋势分析报告发布，多领域迎来自主可控新契机', date: '2025-04-18', link: '/industry-dynamics/103' },
  { id: 104, title: 'AI芯片市场爆发式增长，赋能千行百业智能化转型升级之路，创新应用层出不穷', date: '2025-04-15', link: '/industry-dynamics/104' },
  { id: 105, title: '第三代半导体材料技术突破与产业化应用前景展望研讨会成功举办，专家共话发展蓝图', date: '2025-04-12', link: '/industry-dynamics/105' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.hot-dynamics-sidebar {
  background-color: @background-color-base;
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  border: 1px solid @border-color-light;
}

.sidebar-title {
  font-family: "PingFang SC", @font-family-sans-serif;
  font-weight: 400; // Note: Design spec says 400, but titles often are bolder (500-600)
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0%;
  color: @text-color-base;
  margin: 0 0 @spacing-md 0;
  padding-bottom: @spacing-sm;
  border-bottom: 1px solid @border-color-light;
}

.hot-items-list {
  // AntD List :split="false" removes internal borders. We add our own.
  :deep(.ant-list-item) { // Target AntD's list item for padding reset
    padding: 0 !important; // Remove AntD's default padding for list items
    margin: 0;
  }
}

.hot-item {
  display: block; // Make the link a block to contain its children properly
  width: 344px; // Fixed width for each item's content area
  // height: 77.00003051757812px; // This height is very specific and might be hard to maintain with dynamic text.
                               // Let content flow, or use min-height. For now, content will define height.
  padding: @spacing-md 0; // Vertical padding for each item
  border-bottom: 1px solid #E5E5E5; // Specific border color
  text-decoration: none;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none; // Remove border for the last item
  }

  &:hover {
    .hot-item__title {
      color: @primary-color;
    }
  }

  &__title {
    font-family: "PingFang SC", @font-family-sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: justify; // Justify for potentially multi-line titles
    color: @text-color-secondary;
    margin-bottom: 6px; // Space between title and date
    transition: color 0.3s ease;

    // Text truncation for title (e.g., 2 lines)
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(22px * 2); // line-height * 2 lines
  }

  &__date {
    font-family: "PingFang SC", @font-family-sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0%;
    color: #999999; // Text color
    // background: #999999; // Assuming this was a typo for text color
  }
}
</style>