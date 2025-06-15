<template>
  <div class="related-items-sidebar">
    <h3 class="sidebar-title">{{ title }}</h3>
    <div v-if="isLoading" class="sidebar-loading">
      <a-spin />
    </div>
    <div v-else-if="items && items.length > 0" class="items-list">
      <div
        v-for="item in items"
        :key="item.id"
        class="related-item"
        @click="() => onItemClick(item)"
      >
        <h4 class="item-title">{{ item.title }}</h4>
        <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        <div class="item-meta">
          <span v-if="item.createTime" class="item-date"><CalendarOutlined /> {{ item.createTime }}</span>
          <RightOutlined class="item-arrow" />
        </div>
      </div>
    </div>
    <div v-else class="sidebar-empty">
      <a-empty :description="emptyDescription" :image-style="{ height: '60px' }" />
    </div>
  </div>
</template>

<script setup>
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import { CalendarOutlined, RightOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '相关推荐'
  },
  items: {
    type: Array,
    default: () => [] // Expects items like { id: '1', title: 'Event Title', summary: 'Short summary...', date: '2024/07/30' }
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  emptyDescription: {
    type: String,
    default: '暂无相关内容'
  }
});

const emit = defineEmits(['itemClick']);

const onItemClick = (item) => {
  emit('itemClick', item);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.related-items-sidebar {
  background-color: @background-color-base;
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05); // Consistent with other user center panels
  height: fit-content; // So it doesn't stretch unnecessarily if content is short
}

.sidebar-title {
  font-size: 17px;
  font-weight: 600;
  color: @text-color-base;
  margin-bottom: @spacing-md;
  padding-bottom: @spacing-sm;
  border-bottom: 1px solid @border-color-light;
}

.sidebar-loading, .sidebar-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
}

.related-item {
  padding: @spacing-sm 0;
  border-bottom: 1px dashed @border-color-light;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  &:first-child {
      padding-top: 0;
  }

  &:hover {
    // background-color: fade(@primary-color, 5%);
    .item-title {
      color: @primary-color;
    }
    .item-arrow {
        color: @primary-color;
        transform: translateX(3px);
    }
  }

  .item-title {
    font-size: 15px;
    font-weight: 500;
    color: @text-color-base;
    margin-bottom: @spacing-xs;
    line-height: 1.4;
    // Ellipsis for 2 lines
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s;
  }

  .item-summary {
    font-size: 13px;
    color: @text-color-secondary;
    line-height: 1.6;
    margin-bottom: @spacing-xs;
    display: -webkit-box;
    -webkit-line-clamp: 2; // Show 2 lines for summary
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: @text-color-tertiary;
  }

  .item-date {
    display: inline-flex;
    align-items: center;
    .anticon-calendar {
      margin-right: 4px;
    }
  }
  .item-arrow {
      font-size: 12px;
      transition: color 0.3s, transform 0.3s;
  }
}
</style>