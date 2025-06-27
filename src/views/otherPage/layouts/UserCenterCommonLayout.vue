<template>
  <div class="user-center-common-layout">
    <!-- Banner Section -->
   
    <!-- Main Tabs Section -->
    <section class="uc-main-tabs-wrapper container">
      <div class="">
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
import { Avatar as AAvatar } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useUserCenterTabs } from './hooks/useUserCenterTabs'; // 调整路径
import { useAuthStore } from '@/store/authStore'; // 用于获取用户信息

const route = useRoute();
const authStore = useAuthStore();


// 页签配置 (可以从外部传入或在这里定义更复杂的结构)
// 我们将使用 Hook 内部的 defaultTabsConfig
const {
  activeMainTabKey,
  activeSubTabKey,
  mainTabs,
  currentSubTabs,
  selectMainTab,
} = useUserCenterTabs(); // 使用默认配置

const handleMainTabClick = (key) => {
  selectMainTab(key);
};


</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-center-common-layout {
  background-color: @background-color-light-gray; // 整个页面区域的背景色
  padding-bottom: @spacing-xxl; // 给底部留出一些空间
  margin-top: 20px;
}
.uc-banner {
  background: url('@/assets/images/user_center/Rectangle 221.png'); // 假设你有这个图案
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
    margin-left: 33px;
  }

  &__avatar {
    margin-right: 14px;
    .ant-avatar {
      border: 3px solid rgba(255, 255, 255, 0.5);
    }
  }

  &__info {
    .user-name {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 18px;
      line-height: 18px;
      letter-spacing: 0%;
      text-transform: uppercase;
      margin-bottom: 5px;
      color: @text-color-light;
    }
    .user-membership-info {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .membership-level {
        display: inline-block;
        border-radius: 4px;
        background-color: @primary-color;
        color: #fff;
        padding: 0 8px;
        height: 22px;
        width: 72px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        font-weight: 350;
        line-height: 22px;
        letter-spacing: 0%;
        margin-right: @spacing-sm;
      }
      .upgrade-link {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        line-height: 12px;
        letter-spacing: 0%;
        color: @text-color-light; // 白色文字
        padding: 0;
        height: auto;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .user-id {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 12px;
      letter-spacing: 0%;
      text-transform: uppercase;
      color: @text-color-light;
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
    // flex: 1;
    width: 300px;
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
      background-color: #BC1A2C;
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
  // margin-bottom: @spacing-md; // 与下方内容的间距
  .custom-sub-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 0; // 移除 AntD Tabs 导航下方的默认 margin
      &::before {
        // border-bottom: none; // 移除 AntD Tabs 导航下方的默认边框线
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
      padding: 18px 36px; // 页签的内边距，调整以匹配图片
      margin: 0; // 移除 AntD 页签之间的默认 margin
      border: none; // 移除 AntD 默认边框
      font-weight: 400;
      font-size: 18px;
      line-height: 15px;
      letter-spacing: 0px;
      transition: all 0s;
      color: @text-color-secondary; // 非激活状态文字颜色
      background-color: transparent; // 非激活状态背景透明
      // transition: color 0.3s, background-color 0.3s, border-color 0.3s;
      min-width: 100px; // 给子页签一个最小宽度，使其不至于太挤
      text-align: center;
      border-radius: 0;
      .ant-tabs-tab-btn {
        color: inherit; // 让按钮文字继承页签的颜色
        // &:hover {
        //   color: @primary-color;
        // }
      }
      &:first-child {
        margin-left: 20px;
      }
      &:hover {
        // color: @primary-color;
        border-top: 1px solid #EAEAEA;
        border-left: 1px solid #EAEAEA;
        border-right: 1px solid #EAEAEA;
        border-bottom: 1px solid #fff;
        // background-color: #f7f7f7; // 轻微的悬停背景色
        color: @primary-color; // 激活状态文字颜色
      }
    }

    :deep(.ant-tabs-tab-active) {
      color: @primary-color; // 激活状态文字颜色
      font-weight: 500;
      border-top: 1px solid #EAEAEA;
      border-left: 1px solid #EAEAEA;
      border-right: 1px solid #EAEAEA;
      border-bottom: 1px solid #fff;
      // background-color: fade(@primary-color, 10%); // 图片中激活的子页签没有明显背景色，主要靠文字颜色和下划线
      // border-color: fade(@primary-color, 30%); // 激活状态边框颜色（如果需要）

      .ant-tabs-tab-btn {
        color: #666666;
        text-shadow: none;
      }
    }
    :deep(.ant-tabs-nav::before) {
      // border-bottom: none;
    }
    // :deep(.ant-tabs-ink-bar) { 
    //   background-color: @primary-color; // 红色下划线
    //   height: 2px; // 下划线高度
    // }
  }
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
  background-color: @background-color-base;
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