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
          <p class="user-id">ID: {{ userInfo?.loginTenantId || '加载中...' }}</p>
        </div>
      </div>
    </section>
    {{  }}
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

    <!-- Sub Tabs Section -->
    <section class="uc-sub-tabs-wrapper">
      <div class="container">
        <div class="uc-sub-tabs">
          <div
            v-for="subTab in currentSubTabs"
            :key="subTab.key"
            :class="['sub-tab-item', { 'sub-tab-item--active': activeSubTabKey === subTab.key }]"
            @click="handleSubTabClick(subTab.key)"
          >
            {{ subTab.label }}
          </div>
        </div>
      </div>
    </section>

    <!-- Content Area for Child Routes -->
    <div class="uc-content-area container">
      <router-view v-slot="{ Component }">
        <transition name="fade-fast" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Avatar as AAvatar } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useUserCenterTabs } from './hooks/useUserCenterTabs'; // 调整路径
import { useAuthStore } from '@/store/authStore'; // 用于获取用户信息

const route = useRoute();
const authStore = useAuthStore();
const userInfo = computed(() => authStore.userInfo);
// TODO: 从 authStore 或特定用户 profile hook 获取更详细的用户信息
// const userInfo = computed(() => ({
//   name: authStore.userInfo?.name || '爱芯享信息共享平台', // 示例名称
//   memberId: authStore.user?.id || '16278962361-1456489', // 示例 ID
//   avatarUrl: authStore.user?.avatar || null, // 从 authStore 获取头像
// }));

// 页签配置 (可以从外部传入或在这里定义更复杂的结构)
// 我们将使用 Hook 内部的 defaultTabsConfig
const {
  activeMainTabKey,
  activeSubTabKey,
  mainTabs,
  currentSubTabs,
  selectMainTab,
  selectSubTab,
} = useUserCenterTabs(); // 使用默认配置

const handleMainTabClick = (key) => {
  selectMainTab(key);
};

const handleSubTabClick = (key) => {
  selectSubTab(key);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-center-common-layout {
  background-color: @background-color-light-gray; // 整个页面区域的背景色
  padding-bottom: @spacing-xxl; // 给底部留出一些空间
}

.uc-banner {
  // background: linear-gradient(to right, #2d070a 0%, #3c0a0e 30%, @primary-color 100%),
  //             url('@/assets/images/user_center/banner-pattern.png'); // 假设你有这个图案
  background-blend-mode: multiply, normal; // 将颜色与图案混合
  background-size: auto, auto 150px; // 图案大小
  background-position: center, right 20px center;
  background-repeat: no-repeat;
  padding: @spacing-xl 0;
  color: @text-color-light;
  min-height: 120px; // 确保 banner 有一定高度

  &__content {
    display: flex;
    align-items: center;
  }

  &__avatar {
    margin-right: @spacing-lg;
    .ant-avatar {
      border: 3px solid rgba(255, 255, 255, 0.5);
    }
  }

  &__info {
    .user-name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: @spacing-xs;
      color: @text-color-light;
    }
    .user-id {
      font-size: 13px;
      color: darken(@text-color-light, 20%);
      margin: 0;
    }
  }
}

.uc-main-tabs-wrapper {
  background-color: @background-color-base; // 白色背景
  // box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.uc-main-tabs {
  display: flex;
  height: 60px; // 主页签高度

  .main-tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 @spacing-xxl; // 较大的左右 padding
    font-size: 16px;
    font-weight: 500;
    color: @text-color-base;
    cursor: pointer;
    position: relative;
    transition: color 0.3s, background-color 0.3s;
    min-width: 160px; // 给主页签一个最小宽度

    &--active {
      background-color: @primary-color;
      color: @text-color-light;
    }
    &:not(&--active):hover {
      color: @primary-color;
    }
  }
}

.uc-sub-tabs-wrapper {
  background-color: @background-color-base; // 白色背景
  padding: @spacing-md 0; // 上下 padding
  border-bottom: 1px solid @border-color-light; // 底部分割线
  box-shadow: 0 2px 4px rgba(0,0,0,0.03); // 轻微阴影
  margin-bottom: @spacing-lg; // 与下方内容的间距
}

.uc-sub-tabs {
  display: flex;
  align-items: center;
  gap: @spacing-xs; // 子页签之间的间隙

  .sub-tab-item {
    flex: 1;
    padding: 8px @spacing-md;
    font-size: 14px;
    color: @text-color-secondary;
    cursor: pointer;
    border: 1px solid transparent; // 预留边框空间
    border-radius: @border-radius-base;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    line-height: 1.5;
    text-align: center;
    &:hover {
      color: @primary-color;
      // background-color: fade(@primary-color, 5%);
    }

    &--active {
      color: @primary-color;
      font-weight: 500;
      background-color: fade(@primary-color, 10%); // 淡红色背景
      border-color: fade(@primary-color, 30%); // 红色边框
    }
  }
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