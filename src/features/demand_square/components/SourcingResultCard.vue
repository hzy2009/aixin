<template>
  <a-card :bordered="true" class="sourcing-card">
    <div class="card-top-row">
      <a-tag v-if="item.category" :color="getCategoryColor(item.category)" class="category-tag">{{ item.category }}</a-tag>
      <span class="card-views">
        <UserOutlined /> {{ item.views || 0 }}
      </span>
    </div>

    <h3 class="card-title">{{ item.title }}</h3>

    <div class="card-content">
      <p class="card-description">
        <span class="description-label">项目详情：</span>{{ item.description }}
      </p>
    </div>

    <div class="card-footer">
      <div class="card-meta">
        <span class="meta-item"><CalendarOutlined /> {{ item.date }}</span>
        <span class="meta-item"><EnvironmentOutlined /> {{ item.location }}</span>
      </div>
      <a-button type="default" @click="viewDetails(item.id)" class="details-btn">查看详情</a-button>
    </div>
  </a-card>
</template>

<script setup>
import { Card as ACard, Tag as ATag, Button as AButton } from 'ant-design-vue';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
        id: '',
        category: 'Pump',
        title: '28nm工艺节点芯片设计优化',
        views: 86,
        description: '攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容攻关内容...',
        date: '2024/6/18',
        location: '华东'
    })
  }
});

const router = useRouter();

const getCategoryColor = (category) => {
  if (category?.toLowerCase() === 'pump') return '#E6F7FF'; // Light blue background for AntD like color
  return '#f0f0f0'; // Default background
};
const getCategoryFontColor = (category) => {
  if (category?.toLowerCase() === 'pump') return '#1890FF'; // Blue text
  return '#595959'; // Default text
}


const viewDetails = (id) => {
  // TODO: Navigate to actual details page
  router.push(`/demand-square/detail/${id}`);
  console.log('View details for item ID:', id);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.sourcing-card {
  background-color: @background-color-base;
  // border: 1px solid @border-color-light; // Design shows a very faint or no border on the card itself if it's on a light bg
  border-radius: @border-radius-sm; // Very slight rounding
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); // Subtle shadow
  padding: @spacing-md; // Internal padding for the card content area
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.ant-card-body) { // Remove AntD's default card body padding
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-sm;
}

.category-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: @border-radius-sm;
  border: 1px solid v-bind("getCategoryFontColor(item.category)"); // Use JS variable for border
  color: v-bind("getCategoryFontColor(item.category)"); // Use JS variable for color
  background-color: v-bind("getCategoryColor(item.category)"); // Use JS variable for background
  margin-right: @spacing-sm; // Ensure it doesn't stick if title is short
}

.card-views {
  font-size: 14px;
  color: @primary-color; // Red color for views count
  font-weight: 500;
  .anticon-user {
    margin-right: 4px;
    font-size: 16px; // Slightly larger icon
  }
}

.card-title {
  font-size: 20px; // Larger title as per image
  font-weight: 600;
  color: @text-color-base;
  margin-bottom: @spacing-sm;
  line-height: 1.4;
  // Ellipsis for long titles (optional, if needed)
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.card-content {
  flex-grow: 1; // Pushes footer down
  margin-bottom: @spacing-md;
}

.description-label {
  font-size: 14px;
  color: @text-color-base; // Label color
  font-weight: 400; // Normal weight for "项目详情："
  display: block; // Make it a block to ensure description starts on new line if needed
  margin-bottom: 3px;
}

.card-description {
  font-size: 14px;
  color: @text-color-secondary;
  line-height: 1.6;
  // Multi-line ellipsis
  display: -webkit-box;
  -webkit-line-clamp: 3; // Show 3 lines
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.6em * 3);
  margin: 0; // Remove default p margin
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: @spacing-md;
  border-top: 1px solid @border-color-light; // Separator line
}

.card-meta {
  font-size: 13px;
  color: @text-color-tertiary; // Lighter gray for meta
  display: flex;
  flex-direction: column; // Stack date and location
  gap: 5px; // Small gap between date and location

  .meta-item {
    display: flex;
    align-items: center;
    .anticon {
      margin-right: 6px; // Space after icon
      font-size: 14px;
    }
  }
}

.details-btn {
  border-color: @primary-color;
  color: @primary-color;
  font-weight: 500;
  border-radius: @border-radius-sm;
  padding: 5px 15px; // Adjust padding
  height: auto;

  &:hover, &:focus {
    border-color: @primary-color-dark;
    color: @primary-color-dark;
    background-color: fade(@primary-color, 5%); // Very light red background on hover
  }
}
</style>