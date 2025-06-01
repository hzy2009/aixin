<template>
  <header class="app-header-container">
    <!-- Top Welcome Bar - Full Width -->
    <div class="top-welcome-bar" v-if="showTopWelcomeBar">
      <div class="top-welcome-bar__content container">
        <span class="welcome-text">欢迎来到爱芯享信息共享平台!</span>
        <div class="user-actions-top">
          <template v-if="auth.isAuthenticated">
            <router-link to="/user/my-published" class="top-action-link" v-if="isUserCenterPage">我发布的</router-link>
            <router-link to="/user/member-info" class="top-action-link" v-if="isUserCenterPage">用户管理</router-link>
            <router-link to="/" class="top-action-link" v-if="isUserCenterPage">爱芯享信息共享平台</router-link>
            <a @click="handleLogout" class="top-action-link">退出登录</a>
          </template>
          <template v-else>
            <a @click="navigateToLogin" class="top-action-link">会员登录</a>
            <a @click="navigateToRegister" class="top-action-link register-link-top">会员注册</a>
          </template>
        </div>
      </div>
    </div>

    <!-- Main Header Area (Logo) -->
    <div class="main-header-logo-area">
      <div class="main-header-logo-area__content container">
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <img src="@/assets/images/home/banner.png" alt="LOGO" class="logo-image" />
            <span class="logo-text">爱芯享信息共享平台</span>
          </router-link>
        </div>
        <!-- Spacer or actions for UserCenter view if needed, but top bar mostly handles it -->
        <div class="header-spacer-for-logo-area" v-if="isUserCenterPage"></div>
      </div>
    </div>

    <!-- Unified Navigation Bar (Red Bar, only if NOT in user center) - Full Width -->
    <nav class="unified-navigation-bar" v-if="!isUserCenterPage">
      <div class="unified-navigation-bar__content container">
        <router-link
          v-for="item in navigationItems"
          :key="item.key"
          :to="item.path"
          class="unified-nav-link"
          :class="{ 'unified-nav-link--active': isActiveNavItem(item) }"
        >
          {{ item.label }}
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useNavigation } from './hooks/useNavigation'; // Adjust path if needed

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { navigationItems, isActiveNavItem } = useNavigation();

const isUserCenterPage = computed(() => route.path.startsWith('/user'));
const showTopWelcomeBar = computed(() => true); // Always shown

const navigateToLogin = () => router.push('/login');
const navigateToRegister = () => router.push('/register');

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.app-header-container {
  position: sticky;
  top: 0;
  z-index: @zindex-header;
  background-color: @background-color-base;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); // Subtle shadow for the whole block
}

// 1. Top Welcome Bar (remains similar)
.top-welcome-bar {
  background-color: #f8f8f8;
  height: 36px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: @text-color-secondary;
  // border-bottom: 1px solid @border-color-light; // Optional border

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .user-actions-top {
    display: flex;
    align-items: center;
    gap: @spacing-lg; // Increased gap
    .top-action-link {
      color: @text-color-secondary;
      text-decoration: none;
      &:hover { color: @primary-color; }
    }
    .register-link-top { // Specific style if needed for top bar register
        // e.g. color: @primary-color; font-weight: 500;
    }
  }
}

// 2. Main Header Logo Area
.main-header-logo-area {
  height: @layout-header-height; // e.g., 70px
  display: flex;
  align-items: center;
  background-color: @background-color-base; // White
  border-bottom: 1px solid @border-color-light; // Separator line before red nav if not in user center

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between; // If actions were here for user center
    width: 100%;
  }
}

.logo-section { /* remains similar */
  flex-shrink: 0;
  .logo-link { display: flex; align-items: center; text-decoration: none; }
  .logo-image { height: 36px; margin-right: @spacing-sm; } // Slightly larger logo
  .logo-text { font-size: 24px; font-weight: 600; color: @text-color-base; }
}
.header-spacer-for-logo-area {
    flex-grow: 1; // For user center view, if logo is alone and you want it left-aligned
}


// 3. Unified Navigation Bar (Red Bar)
.unified-navigation-bar {
  background-color: @primary-color;
  height: 50px; // Adjust height
  display: flex;
  align-items: center;

  &__content { // This is the .container
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0; // No gap, links will manage their own padding/margin for "flat" look
    overflow-x: auto; // Allow horizontal scrolling on small screens if many items
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar { /* Chrome, Safari, Opera */
        display: none;
    }
  }

  .unified-nav-link {
    color: fade(@text-color-light, 90%);
    font-size: 15px; // Consistent font size
    font-weight: 500;
    text-decoration: none;
    padding: 0 @spacing-md; // Horizontal padding for each link
    height: 50px; // Make link take full height of the bar
    line-height: 50px;
    // display: inline-flex;
    align-items: center;
    white-space: nowrap; // Prevent wrapping
    transition: background-color 0.2s, color 0.2s;
    border-right: 1px solid darken(@primary-color, 5%); // Subtle separator
    flex: 1;
    text-align: center;
    &:first-child {
        // border-left: 1px solid darken(@primary-color, 5%); // Optional left border for first
    }
    &:last-child {
        border-right: none; // No separator for the last item
    }

    &:hover {
      color: @text-color-light;
      background-color: darken(@primary-color, 8%);
    }
    &--active {
      color: @text-color-light;
      background-color: darken(@primary-color, 12%);
      font-weight: 600;
    }
  }
}
</style>