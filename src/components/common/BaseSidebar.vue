<template>
  <div class="recommended-reports-list">
    <div v-if="isLoading || !props.code" class="loading-placeholder">
      <a-skeleton 
        active 
        :paragraph="{ rows: 4 }" 
        v-for="i in skeletonCount" 
        :key="`ske-${i}`" 
        class="skeleton-item" 
      />
    </div>
    <div v-else-if="tableData.length > 0" class="reports-list-items">
      <router-link 
        v-for="item in displayData" 
        :key="item.id"
        :to="getItemLink(item)" 
        class="report-item-link"
        @click="handleItemClick(item)"
      >
        <div class="report-item-content">
          <slot name="item" :item="item">
            <!-- 根据组件类型渲染不同内容 -->
            <template v-if="variant === 'talent'">
              <!-- 人才侧边栏样式 -->
              <h2 class="report-item-title">
                <img src="@/assets/images/auth/avatar.png" alt="">
                <span>{{ item.code }}</span>
                <ArrowRightOutlined class="arrow-icon" />
              </h2>
              <p class="report-item-title">{{ item.skillAreaName }}</p>
              <p class="report-item-meta">意愿合作方向：{{ item.desiredCooperationDirection }}</p>
              <p class="report-item-meta">主要研究方向：{{ item.skillDesc }}</p>
            </template>
            <template v-else-if="variant === 'report'">
              <!-- 行业报告侧边栏样式 -->
              <h4 class="report-item-title">{{ item.reportName }}</h4>
              <p class="report-item-meta">领域：{{ item.reportTypeName }}</p>
              <p class="report-item-meta">
                <div class="report-item-description">
                  <span>摘要：</span>
                  <p v-html="item.description"></p>
                </div>
              </p>
              <div class="report-item-footer">
                <span class="report-item-price"><span class="currency-symbol">¥</span> ***</span>
                <ArrowRightOutlined class="arrow-icon" />
              </div>
            </template>
            <template v-else-if="variant === 'offline'">
              <!-- 线下活动侧边栏样式 -->
              <h2 class="report-item-title">{{ item.activityName }}</h2>
              <p class="report-item-meta">活动内容：{{ item.description }}</p>
              <div class="report-item-footer report-item-summary">
                <span>活动时间：{{ item.activityDate }}</span>
                <ArrowRightOutlined class="arrow-icon" />
              </div>
            </template>
            <template v-else-if="variant === 'public'">
              <!-- 公共关系/定制开发侧边栏样式 -->
              <h2 class="report-item-title">{{ item.code }}</h2>
              <p class="report-item-meta fontSizeitem">定制开发类型：{{ item.rdType }}</p>
              <div class="report-item-footer report-item-summary fontSizeitem">
                <span>期望完成日期：{{ item.expireDate ? formatDate(item.expireDate) : '' }}</span>
                <ArrowRightOutlined class="arrow-icon" />
              </div>
            </template>
            <template v-else-if="variant === 'verification'">
              <!-- 验证检测侧边栏样式 -->
              <h2 class="report-item-title">{{ item.code }}</h2>
              <p class="report-item-meta fontSizeitem">产品类别：{{ getSelectDisplayValue(item.productType, 'product_type') }}</p>
              <p class="report-item-meta fontSizeitem">检测验证类别：{{ getSelectDisplayValue(item.projectType, 'project_type') }}</p>
              <div class="report-item-footer report-item-summary fontSizeitem">
                <span>期望完成日期：{{ item.expireDate ? formatDate(item.expireDate) : '' }}</span>
                <ArrowRightOutlined class="arrow-icon" />
              </div>
            </template>
            <template v-else>
              <!-- 默认侧边栏样式 (Domestic、OEM等) -->
              <h2 class="report-item-title">{{ item.code }}</h2>
              <p v-if="variant === 'domestic' || variant === 'oem'" class="report-item-meta fontSizeitem">物料：{{ item.materialCode }}</p>
              <div v-if="variant === 'domestic' || variant === 'oem'" class="report-item-footer report-item-summary fontSizeitem">
                <span>期望完成日期：{{ item.expireDate ? formatDate(item.expireDate) : '' }}</span>
                <ArrowRightOutlined class="arrow-icon" />
              </div>
            </template>
          </slot>
        </div>
      </router-link>
    </div>
    <a-empty v-else :description="emptyDescription" class="empty-state" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { useUserDemandList } from '@/components/template/hooks/useUserDemandList.js';
import { formatDate, selectOptions } from '@/utils/index.js';

const props = defineProps({
  // 基础配置 - 保持与原组件完全一致
  currentReportId: { type: [String, Number], default: null },
  category: { type: String, default: null },
  count: { type: Number, default: 4 },
  code: { type: String, default: '' },
  
  // 组件变体类型
  variant: { 
    type: String, 
    required: true // 'domestic', 'talent', 'oem', 等
  },
  
  // 数据配置
  apiUrl: { 
    type: String, 
    required: true 
  },
  sourcingType: { 
    type: String, 
    default: '' 
  },
  
  // 路由配置
  routePrefix: { 
    type: String, 
    required: true 
  },
  
  // 显示文本配置
  emptyDescription: { 
    type: String, 
    default: '暂无相关报告' 
  }
});

const emit = defineEmits(['reportClick', 'itemClick']);

// 骨架屏数量 - 与原组件逻辑一致
const skeletonCount = computed(() => props.count);

// 构建API参数 - 与原组件逻辑一致
const apiParams = computed(() => {
  const baseParams = {
    code: `!${props.code}`
  };
  
  if (props.sourcingType) {
    baseParams.sourcingType = props.sourcingType;
  }
  
  return baseParams;
});

// 使用统一的数据加载Hook - 与原组件完全一致
const {
  isLoading,
  tableData,
  loadTableData
} = useUserDemandList({
  url: {
    list: props.apiUrl,
  },
  otherParams: apiParams.value
});

// 监听code变化 - 与原组件逻辑一致
watch(() => props.code, () => {
  if (props.variant === 'talent' && !props.code) return;
  
  loadTableData({
    code: `!${props.code}`
  });
});

// 显示的数据 - 与原组件完全一致
const displayData = computed(() => {
  return tableData.value.slice(0, props.count);
});

// 生成路由链接 - 与原组件完全一致
const getItemLink = (item) => {
  return `${props.routePrefix}/${item.id}`;
};

// 处理点击事件 - 与原组件完全一致
const handleItemClick = (item) => {
  emit('reportClick'); // 保持原有事件名
  emit('itemClick', item); // 新增通用事件名
};

// 获取选择项显示值 - 用于verification变体
const getSelectDisplayValue = (value, dictKey) => {
  const optionsList = selectOptions(dictKey);
  const option = optionsList.find(opt => opt.value === value);
  return option ? option.label : (value || '-');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// 完全复制现有样式，确保兼容性
.recommended-reports-list {
  width: 282px;
  // The parent container (.sidebar-column in IndustryReportDetailPage.vue)
  // should provide the overall background and border for the sidebar area.
  // This component now only focuses on the list of items.
}

.reports-list-items {
  display: flex;
  flex-direction: column;
  // gap: @spacing-md; // Gap will be handled by report-item-link's margin or padding
}

.report-item-link {
  display: block;
  color: inherit;
  text-decoration: none;
  background-color: #fff;
  padding: 17px 20px 27px;
  margin-bottom: 24px;
  border-radius: 2px;
  transition: box-shadow .3s ease, border-color .3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: darken(@border-color-light, 5%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .report-item-title {
      color: @primary-color;
    }

    .arrow-icon {
      color: @primary-color;
      transform: translateX(-4px);
    }
  }
}

.report-item-content {
  // Inner div for content if needed, or apply styles directly to link
  // No specific styles needed here if link itself handles padding and layout
}

.report-item-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.4em;
  
  // 人才侧边栏特殊样式
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

// 人才侧边栏的特殊标题样式（避免重复覆盖）
.talent-title {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: #272A30;
}

.fontSizeitem {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 12px;
  letter-spacing: 0%;
  text-align: justify;
  color: #656C74;
}

.report-item-meta {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.report-item-summary {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.4em;
  // min-height: calc(1.2em * 2);
}

.report-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow-icon {
  font-size: 16px;
  color: #BFBFBF;
  transition: color 0.2s ease, transform 0.2s ease;
  
  // 人才侧边栏特殊位置（仅在人才页面应用）
}

.loading-placeholder {
  .skeleton-item {
    background-color: @background-color-base;
    padding: @spacing-lg;
    margin-bottom: @spacing-lg;
    border: 1px solid @border-color-light;
    border-radius: @border-radius-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.empty-state {
  background-color: @background-color-base;
  padding: @spacing-xl;
  border: 1px solid @border-color-light;
  border-radius: @border-radius-sm;
}

// 行业报告特殊样式
.report-item-description {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: justify;
  color: #656C74;
  height: 66px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  
  span {
    display: inline;
  }
  
  p {
    display: inline;
  }
  
  :deep(p) {
    display: inline;
  }
}

.report-item-price {
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  text-transform: uppercase;
  color: @primary-color;
  
  .currency-symbol {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 12px;
    letter-spacing: 0%;
    text-transform: uppercase;
  }
}
</style>