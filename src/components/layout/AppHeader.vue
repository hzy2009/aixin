<template>
  <header class="app-header-container">
    <!-- Top Welcome Bar - Full Width -->
    <div class="top-welcome-bar" v-if="showTopWelcomeBar">
      <div class="top-welcome-bar__content container">
        <span class="welcome-text">欢迎来到爱芯享信息共享平台!</span>
        <div class="user-actions-top">
          <template v-if="auth.isLogin">
            <router-link to="/user/published" class="top-action-link">我发布的</router-link>
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
        <div class="header-spacer-for-logo-area" ></div>
      </div>
    </div>

    <!-- Unified Navigation Bar (Red Bar, only if NOT in user center) - Full Width -->
    <nav class="unified-navigation-bar">
      <div class="unified-navigation-bar__content container">
        <div
          v-for="(item, i) in navigationItems"
          :key="item.key + i"
          class="unified-nav-item-wrapper"
          :class="{ 'has-submenu': item.subItems && item.subItems.length > 0 }"
        >
          <router-link
            :key="item.key"
            :to="item.path"
            class="unified-nav-link"
          >
            {{ item.label }}
          </router-link>

          <!-- Pure CSS Hover Submenu -->
          <ul v-if="item.subItems && item.subItems.length > 0" class="css-submenu">
            <li v-for="subItem in item.subItems" :key="subItem.key" class="css-submenu-item">
              <router-link :to="subItem.path" class="css-submenu-link">{{ subItem.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useNavigation } from './hooks/useNavigation';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { navigationItems, isActiveNavItem } = useNavigation();

const showTopWelcomeBar = computed(() => true);

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
      cursor: pointer;
      color: @text-color-secondary;
      text-decoration: none;
      &:hover { color: @primary-color; }
    }
    .register-link-top { // Specific style if needed for top bar register
        // e.g. color: @primary-color; font-weight: 500;
    }
  }
}

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

.logo-section {
  flex-shrink: 0;
  .logo-link { display: flex; align-items: center; text-decoration: none; }
  .logo-image { height: 36px; margin-right: @spacing-sm; } // Slightly larger logo
  .logo-text { font-size: 24px; font-weight: 600; color: @text-color-base; }
}
.header-spacer-for-logo-area {
    flex-grow: 1; // For user center view, if logo is alone and you want it left-aligned
}

.unified-navigation-bar {
  background-color: @primary-color;
  height: 50px; // Adjust height
  display: flex;
  align-items: center;

  &__content {
    display: flex;
    align-items: center; // Make wrappers take full height
    width: 100%;
    height: 100%;
    gap: 0;
  }
}

.unified-nav-item-wrapper {
  position: relative; // Crucial for positioning the submenu
  height: 50px; // Make link take full height of the bar
  line-height: 50px;// To align link within wrapper (if link itself isn't full height)
  align-items: stretch; // Make router-link take full height of wrapper

  // &:last-child {
  //   border-right: none;
  // }
    flex: 1;
    text-align: center;
  .unified-nav-link {
    color: fade(@text-color-light, 90%);
    font-size: 15px; // Consistent font size
    font-weight: 500;
    display: inline-block;
    width: 100%;
    text-decoration: none;
    padding: 0 @spacing-md; // Horizontal padding for each link
    height: 50px; // Make link take full height of the bar
    line-height: 50px;
    // display: inline-flex;
    align-items: center;
    white-space: nowrap; // Prevent wrapping

    // justify-content: center;
    // white-space: nowrap;
    transition: background-color 0.2s, color 0.2s;
    cursor: pointer; // Make it look clickable
    

    .nav-arrow-icon {
      margin-left: @spacing-xs;
      font-size: 10px;
      transition: transform 0.2s ease-in-out;
    }

    &:hover {
      color: @text-color-light;
      background-color: darken(@primary-color, 5%);
    }
    &.--active,
    &.router-link-exact-active {
      color: @text-color-light;
      background-color: darken(@primary-color, 10%);
      font-weight: 500;
    }
  }

  // Pure CSS Submenu (initially hidden)
  .css-submenu {
    display: none; // Hidden by default
    position: absolute;
    top: 100%; // Position below the parent nav item
    left: 0;
    min-width: 100%; // At least as wide as the parent
    background-color: #fff; // Background for submenu
    list-style: none;
    margin: 0;
    padding: 0; // Padding top/bottom for the ul
    z-index: @zindex-header + 10; // Ensure it's above other content
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 0 0 @border-radius-sm @border-radius-sm; // Rounded bottom corners
    border-top: 1px solid darken(@primary-color, 10%); // Separator from main nav

    .css-submenu-item {
      // No specific styling needed if link takes full space
    }

    .css-submenu-link {
      display: block;
      font-size: 14px;
      color: #656C74;
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.2s, color 0.2s;
      height: 47px;
      line-height: 47px;
      padding: 0 12px;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      letter-spacing: 0%;

      &:hover {
        background-color: darken(@primary-color, 12%);
        color: @text-color-light;
      }
    }
  }

  // Show submenu on hover of the wrapper
  &:hover {
    .css-submenu {
      display: block;
    }
    .unified-nav-link .nav-arrow-icon { // Rotate arrow on hover
        transform: rotate(180deg);
    }
  }
}
</style>