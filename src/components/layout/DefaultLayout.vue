<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="getTransitionName(route)" appear>
          <Suspense>
            <template #default>
              <component :is="Component" :key="route.path" />
            </template>
            <template #fallback>
              <div class="loading-container">
                <a-spin size="large" />
              </div>
            </template>
          </Suspense>
        </transition>
      </router-view>
    </main>
    <AppFooter />
     <FixedActionButtons
      contact-phone-number="4000118892"
    />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import FixedActionButtons from '@/components/common/FixedActionButtons.vue'; // Adjust path

// 根据路由决定过渡动画类型
const getTransitionName = (route) => {
  // 可以根据路由深度或特定规则来决定动画方向
  if (route.meta?.transitionName) {
    return route.meta.transitionName;
  }
  
  // 默认使用最丝滑的淡入动画，减少闪缩感
  return 'slide-fade';
  // 项目现在支持5种过渡动画：

  // 1. slide-fade (默认): 滑入淡出效果
  // 2. fade: 纯淡入淡出
  // 3. slide-up: 向上滑入
  // 4. zoom: 缩放效果
  // 5. rotate-fade: 旋转淡入
};
</script>

<style scoped lang="less">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Ensure layout takes full viewport height
}

.main-content {
  background-color: #FAFAFA;
  flex-grow: 1; // Allows main content to expand and push footer down
  position: relative; // 为动画定位做准备
  // 启用硬件加速，提升动画性能
  transform: translateZ(0);
  will-change: transform;
  // Optional: add some default padding if all pages need it
  // padding-top: @spacing-lg;
  // padding-bottom: @spacing-lg;
}

// 加载容器样式
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
}

// 页面过渡动画样式 - 优化版本
// 所有动画元素启用硬件加速
.slide-fade-enter-active,
.slide-fade-leave-active,
.fade-enter-active,
.fade-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.zoom-enter-active,
.zoom-leave-active,
.rotate-fade-enter-active,
.rotate-fade-leave-active {
  // 启用硬件加速
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
  // 防止字体模糊
  -webkit-font-smoothing: antialiased;
}

// 默认滑入淡出动画 - 更丝滑的缓动函数
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(15px) translateZ(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-15px) translateZ(0);
}

// 淡入淡出动画 - 最丝滑，减少闪缩感
.fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 向上滑入动画 - 减小位移距离
.slide-up-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px) translateZ(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-12px) translateZ(0);
}

// 缩放动画 - 微调缩放比例
.zoom-enter-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-leave-active {
  transition: all 0.18s cubic-bezier(0.4, 0, 1, 1);
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.98) translateZ(0);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.02) translateZ(0);
}

// 旋转淡入动画 - 减小旋转角度
.rotate-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-2deg) scale(0.98) translateZ(0);
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(2deg) scale(1.02) translateZ(0);
}
</style>