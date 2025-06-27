<template>
  <header class="app-header-container">
    <!-- Top Welcome Bar - Full Width -->
    <div class="top-welcome-bar" v-if="showTopWelcomeBar">
      <div class="top-welcome-bar__content container">
        <span class="welcome-text">欢迎来到爱芯享信息共享平台！</span>
        <div class="user-actions-group">
          <template v-if="auth.isLogin">
             <span :count="unreadMessagesCount" :overflow-count="99" class="action-item notification-badge" @click="navigateToMessages">
              <BellOutlined />
              <span class="action-text">您有{{ unreadMessagesCount }}条待办事项</span>
             </span>
            <router-link to="/user/setting/userCenterInfo" class="action-item action-link"> 
              会员中心
            </router-link>
            <a @click="handleLogout" class="action-item action-link">
              退出登录
            </a>
          </template>
          <template v-else>
            <a @click="navigateToRegister" class="top-action-link register-link-top">入会指南</a>
            <a @click="navigateToLogin" class="top-action-link">会员登录</a>
          </template>
        </div>
      </div>
    </div>

    <!-- Main Header Area (Logo) -->
    <div class="main-header-logo-area">
      <div class="main-header-logo-area__content container">
        <div class="logo-section">
          <div class="logo-link">
            <img src="@/assets/images/logo.png" alt="LOGO" class="logo-image" />
            <span class="logo-text">爱芯享信息共享平台</span>
          </div>
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
          <div
            :key="item.key"
            :to="item.path"
            @click="handleMenuClick(item)"
            class="unified-nav-link"
            :class="{ 'is-active': isActiveNavItem(item) }"
          >
            {{ item.label }}
          </div>

          <!-- Pure CSS Hover Submenu -->
          <ul v-if="auth.isLogin && item.subItems && item.subItems.length > 0" class="css-submenu">
            <li v-for="subItem in item.subItems" :key="subItem.key" class="css-submenu-item">
              <span :to="subItem.path" class="css-submenu-link" @click="handleMenuClick(subItem)">{{ subItem.label }}</span >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useNavigation } from './hooks/useNavigation';
import { BellOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { navigationItems, isActiveNavItem } = useNavigation();

const unreadMessagesCount = ref(0);

const showTopWelcomeBar = computed(() => true);

const navigateToLogin = () => router.push('/login');
const navigateToRegister = () => {
  router.push('/other/membershipGuide')
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
const handleMenuClick = (item) => {
  // Handle menu item click, e.g., navigate to the corresponding route
  if (item.fn) {
    item.fn(router, message)
  } else {
    router.push(item.path);
  }
}
const getUnreadMessagesCount = async () => {
  try {
    if (!auth.isLogin) return
    const res = await defHttp.get({ url: '/apm/apmTodo/join/newTodo/list', params: { page: 1, pageSize: 99 } });
    unreadMessagesCount.value = res.result.total;
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
  }
}
const navigateToMessages = () => {
  router.push('/todo/list');
}

onMounted(() => {
  getUnreadMessagesCount();
});
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
  height: 38px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: @text-color-secondary;
  // border-bottom: 1px solid @border-color-light; // Optional border
  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  // .user-actions-top {
  //   display: flex;
  //   align-items: center;
  //   gap: @spacing-lg; // Increased gap
    .top-action-link {
      cursor: pointer;
      color: @text-color-secondary;
      text-decoration: none;
      &:hover { color: @primary-color; }
    }
  //   .register-link-top { // Specific style if needed for top bar register
  //       // e.g. color: @primary-color; font-weight: 500;
  //   }
  // }
  .user-actions-group {
  display: flex;
  align-items: center;
  gap: 20px; // Space between action items

  .action-item {
    display: flex;
    align-items: center;
    color: #646A73; // Default color for links
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: @primary-color; // Red on hover
    }

    .anticon {
      margin-right: 6px;
      font-size: 16px; // Icon size
    }
    .action-text {
    }
  }
  .notification-badge {
      cursor: pointer;
    .anticon-bell {
      color: @primary-color; // Bell icon is red
    }
    .action-text{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 16px;
      line-height: 14px;
      letter-spacing: 0%;
      color: @primary-color; // Red on hover
      text-decoration: none;
      &:hover{
      color: @primary-color; // Bell icon is red
        
      }
    }
     // AntD badge customization if needed
    :deep(.ant-badge-count) {
      background-color: @primary-color;
      box-shadow: none;
      // Adjust position if necessary
      // top: -2px;
      // right: -2px;
    }
  }

  .action-link { // For "会员中心", "退出登录"
    padding: 0 8px; // Add some padding to make them feel like separate links
    position: relative; // For pseudo-element separator

    // Vertical separator line (except for the last item)
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -12px; // Half of the gap
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 12px; // Height of the separator
      background-color: #DCDFE6; // Separator color
    }
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
  .logo-text { 
    color: @primary-color;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 30px;
    line-height: 30px;
    letter-spacing: 0%;
 }
}
.header-spacer-for-logo-area {
    flex-grow: 1; // For user center view, if logo is alone and you want it left-aligned
}

.unified-navigation-bar {
  background-color: @primary-color;
  height: 54px; // Adjust height
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
  height: 54px; // Make link take full height of the bar
  line-height: 54px;// To align link within wrapper (if link itself isn't full height)
  align-items: stretch; // Make router-link take full height of wrapper

  // &:last-child {
  //   border-right: none;
  // }
    flex: 1;
    text-align: center;
  .unified-nav-link {
    cursor: pointer;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 18px;
    letter-spacing: 0%;
    text-align: center;
    color: #fff;
    display: inline-block;
    width: 100%;
    text-decoration: none;
    padding: 0 @spacing-md; // Horizontal padding for each link
    height: 54px; // Make link take full height of the bar
    line-height: 54px;
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
      cursor: pointer;
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
        background-color: @primary-color;
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
  .is-active {
    color: @text-color-light;
    background-color: darken(@primary-color, 10%);
    font-weight: 500;
  }
}
</style>