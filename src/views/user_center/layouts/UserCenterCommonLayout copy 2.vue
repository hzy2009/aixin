<template>
  <div class="user-center-common-layout">
    <!-- Banner Section -->
    <section class="uc-banner">
      <div class="container uc-banner__content">
        <div class="uc-banner__avatar">
          <a-avatar :size="80" :src="userInfo?.avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
        <div class="uc-banner__info">
          <h2 class="user-name">{{ userInfo?.realname || '会员用户' }}</h2>
          <div class="user-membership-info">
            <span class="membership-level">{{ userInfo?.memberLevel || '普通会员' }}</span>
            <a-button type="link" class="upgrade-link" v-if="!isHighestLevel(userInfo?.memberLevel)">升级会员</a-button>
          </div>
          <p class="user-id">ID: {{ userInfo?.loginTenantId || '加载中...' }}</p>
        </div>
      </div>
    </section>

    <!-- Main Tabs Section -->
    <section class="uc-main-tabs-wrapper">
      <div class="container">
        <div class="uc-main-tabs">
          <div
            v-for="tab in mainTabs"
            :key="tab.key"
            :class="['main-tab-item', { 'main-tab-item--active': activeMainTabKey === tab.key }]"
            @click="handleMainTabClick(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
    </section>

    <!-- Sub Tabs Section - 改用 a-tabs -->
    <section class="uc-sub-tabs-antd-wrapper">
      <div class="container">
        <a-tabs
          v-if="currentSubTabs.value && currentSubTabs.value.length > 0"
          :active-key="activeSubTabKey.value"
          @tabClick="handleAntdSubTabClick"
          class="custom-sub-tabs"
          :tabBarGutter="0"
        >
          <a-tab-pane
            v-for="subTab in currentSubTabs.value"
            :key="subTab.key"
            :tab="subTab.label"
          >
            <!-- 内容将通过下方的 router-view 渲染，这里不需要 pane 的内容 -->
          </a-tab-pane>
        </a-tabs>
         <!-- 如果某个主页签没有子页签 (比如账户管理本身就是内容页)，则不显示子页签区域 -->
         <div v-else class="no-sub-tabs-placeholder">
            <!-- 可以留空，或者根据设计添加一些内边距/高度 -->
         </div>
      </div>
    </section>

    <!-- Content Area for Child Routes -->
    <div class="uc-content-area container">
      <router-view v-slot="{ Component }">
        <transition name="fade-fast" mode="out-in">
            <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Avatar as AAvatar, Tabs as ATabs, TabPane as ATabPane, Button as AButton } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useUserCenterTabs } from './hooks/useUserCenterTabs'; // 调整路径
import { useAuthStore } from '@/store/authStore';

const route = useRoute();
const authStore = useAuthStore();
const userInfo = computed(() => authStore.userInfo);

const isHighestLevel = (level) => {
    // TODO: 实现判断是否为最高等级会员的逻辑
    return level === '高级会员'; // 示例
};

const {
  activeMainTabKey,
  activeSubTabKey,
  mainTabs,
  currentSubTabs,
  selectMainTab,
  selectSubTab,
} = useUserCenterTabs();

const handleMainTabClick = (key) => {
  selectMainTab(key);
};

const handleAntdSubTabClick = (key) => {
  // a-tabs 的 @tabClick 事件参数是 key
  selectSubTab(key);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-center-common-layout { /* ...保持不变... */ }

.uc-banner {
  /* ... 你的 Banner 样式，根据图片调整 ... */
  /* 确保背景图路径正确 */
  background: url('@/assets/images/user_center/banner-bg.png') no-repeat center center; // 替换为你的banner背景图
  background-size: cover;
  padding: 30px 0; // 调整内边距
  color: @text-color-light;
  min-height: 140px;

  &__content {
    display: flex;
    align-items: center;
    // margin-left: 33px; // 这个可以去掉，让 container 控制
  }

  &__avatar {
    margin-right: @spacing-lg;
    .ant-avatar {
      border: 3px solid rgba(255, 255, 255, 0.7); // 边框更明显一点
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
  }

  &__info {
    .user-name {
      font-size: 22px; // 稍大一点
      font-weight: 600;
      margin-bottom: 6px;
      color: @text-color-light;
    }
    .user-membership-info {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      .membership-level {
        background-color: fade(@primary-color, 80%); // 根据图片是红色底白色字
        color: @text-color-light;
        padding: 2px 8px;
        border-radius: @border-radius-sm;
        font-size: 12px;
        margin-right: @spacing-sm;
      }
      .upgrade-link {
        color: @text-color-light; // 白色文字
        font-size: 12px;
        padding: 0;
        height: auto;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .user-id {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8); // 稍浅的白色
      margin: 0;
    }
  }
}

.uc-main-tabs-wrapper { /* ...保持不变... */ }

.uc-main-tabs {
  display: flex;
  height: 60px;
  background-color: @background-color-base;

  .main-tab-item {
    // flex: 1; // 取消 flex:1，让内容决定宽度，但有最小宽度
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px; // 调整 padding
    font-size: 16px;
    font-weight: 500;
    color: @text-color-base;
    cursor: pointer;
    position: relative;
    transition: color 0.3s, background-color 0.3s;
    border-right: 1px solid @border-color-light; // 右边框作为分隔

    &:first-child {
       // border-left: 1px solid @border-color-light; // 可选：第一个左边框
    }

    &.account-management-tab { // “账户管理”页签靠右
        margin-left: auto;
        border-left: 1px solid @border-color-light; // 左边框
    }


    &--active {
      background-color: @primary-color; // 主题红色
      color: @text-color-light;
      // border-right-color: @primary-color; // 激活时边框颜色也变
    }
    &:not(&--active):hover {
      color: @primary-color;
      background-color: fade(@primary-color, 5%); // 轻微背景色
    }
  }
}

// 新的 Antd Tabs 包装器和自定义样式
.uc-sub-tabs-antd-wrapper {
  background-color: @background-color-base;
  // padding: 12px 0 0 0; // 调整上边距，取消下边距，由tabs内部控制
  border-bottom: 1px solid @border-color-light; // 图片中子页签区域底部有一条线
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  margin-bottom: @spacing-lg;

  .custom-sub-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 0; // 移除 AntD Tabs 导航下方的默认 margin
      &::before {
        border-bottom: none; // 移除 AntD Tabs 导航下方的默认边框线
      }
    }

    :deep(.ant-tabs-nav-wrap) {
      // 如果需要，可以对包裹层进行样式调整，比如去除默认的渐变阴影（如果存在）
      // overflow: visible; // 如果有内容溢出问题
    }
    :deep(.ant-tabs-nav-list) {
      // 这里是实际的页签列表
    }

    :deep(.ant-tabs-tab) {
      padding: 12px 20px; // 页签的内边距，调整以匹配图片
      margin: 0; // 移除 AntD 页签之间的默认 margin
      font-size: 14px;
      color: @text-color-secondary; // 非激活状态文字颜色
      background-color: transparent; // 非激活状态背景透明
      border: none; // 移除 AntD 默认边框
      border-right: 1px solid @border-color-light; // 页签之间的分隔线
      transition: color 0.3s, background-color 0.3s, border-color 0.3s;
      min-width: 100px; // 给子页签一个最小宽度，使其不至于太挤
      text-align: center;

      &:last-child {
        border-right: none; // 最后一个页签没有右边框
      }

      .ant-tabs-tab-btn {
        color: inherit; // 让按钮文字继承页签的颜色
        &:hover {
          color: @primary-color;
        }
      }

      &:hover {
        color: @primary-color;
        // background-color: #f7f7f7; // 轻微的悬停背景色
      }
    }

    :deep(.ant-tabs-tab-active) {
      color: @primary-color; // 激活状态文字颜色
      font-weight: 500;
      // background-color: fade(@primary-color, 10%); // 图片中激活的子页签没有明显背景色，主要靠文字颜色和下划线
      // border-color: fade(@primary-color, 30%); // 激活状态边框颜色（如果需要）

      .ant-tabs-tab-btn {
        color: @primary-color;
      }
    }

    :deep(.ant-tabs-ink-bar) { 
      background-color: @primary-color; // 红色下划线
      height: 2px; // 下划线高度
    }
  }
}
.no-sub-tabs-placeholder {
    height: 48px; // 保持一个最小高度，与有子页签时一致，避免页面跳动
    background-color: @background-color-base;
    border-bottom: 1px solid @border-color-light;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    margin-bottom: @spacing-lg;
}


.uc-content-area {
  // .container 类已处理了最大宽度和居中
  // 子路由的内容将在这里渲染
}
// 过渡效果
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>