<template>
  <div class="user-center-layout-wrapper">
    <AppHeader />
    <div class="user-center-main-content container">
      <aside class="user-center-sidebar-container">
        <UserCenterSidebar />
      </aside>
      <main class="user-center-page-content">
       <a-breadcrumb v-if="breadcrumbs.length" class="page-breadcrumb">
        <a-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link v-if="crumb.path" :to="crumb.path">{{ crumb.name }}</router-link>
          <span v-else>{{ crumb.name }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
        <div class="content-area">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import UserCenterSidebar from '../components/UserCenterSidebar.vue';
import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';

const route = useRoute();

const breadcrumbs = computed(() => {
  const matchedBreadcrumbs = route.meta.breadcrumb; // This is an array of strings
  const base = route.meta.breadcrumbBase || []; // New: base breadcrumb from parent route
  const combined = [...base, ...matchedBreadcrumbs];

  if (Array.isArray(combined) && combined.length > 0) {
    return combined.map((name, index) => {
      // A more robust breadcrumb might involve actual paths for intermediate items
      // For now, just names
      return { name };
    });
  }
  return [];
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-center-layout-wrapper {
  display: flex;
  flex-direction: column;
  // min-height: 100vh;
  background-color: #f0f2f5; // Common dashboard background color
}

.user-center-main-content {
  display: flex;
  flex-grow: 1;
  padding-top: @spacing-lg;
  padding-bottom: @spacing-lg;
  gap: @spacing-lg; // Gap between sidebar and content
}

.user-center-sidebar-container {
  width: 220px; // Fixed width for sidebar as per design
  flex-shrink: 0;
  background-color: @background-color-base; // White background for sidebar
  border-radius: @border-radius-base;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  // overflow-y: auto; // If menu becomes too long
}

.user-center-page-content {
  flex-grow: 1;
  background-color: @background-color-base; // White background for content area
  padding: @spacing-lg;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column; // To stack breadcrumb and content-area
  min-width: 0; // Prevent flexbox overflow issues with content
}

.page-breadcrumb {
  margin-bottom: @spacing-lg;
  font-size: 14px;
}

.content-area {
  flex-grow: 1; // Ensure content area takes remaining space
}

// Basic fade transition for router-view
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>