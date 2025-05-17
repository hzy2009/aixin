<template>
  <header class="app-header">
    <div class="header-content container">
      <div class="logo-section">
        <!-- Replace with your actual logo component or image -->
        <router-link to="/" class="logo-link">
          <img src="@/assets/images/logo.png" alt="LOGO 爱芯享信息共享平台" class="logo-image" />
          <span class="logo-text">爱芯享信息共享平台</span>
        </router-link>
      </div>
      <nav class="navigation">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/industry-dynamics" class="nav-link">行业动态</router-link>
        <router-link to="/demand-square" class="nav-link">需求广场</router-link>
        <router-link to="/tech-forum" class="nav-link">技术论坛</router-link>
      </nav>
      <div class="user-actions">
        <!-- Conditional rendering based on authStore -->
        <template v-if="auth.isAuthenticated">
          <span>你好, {{ auth.user?.name || '会员' }}</span>
          <a-button type="link" @click="handleLogout" class="action-link">退出登录</a-button>
        </template>
        <template v-else>
          <a-button type="link" @click="navigateToLogin" class="action-link">会员登录</a-button>
          <a-button type="primary" @click="navigateToRegister" class="action-button-register">会员注册</a-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore.js'; // Assuming you have an auth store
// import { Button as AButton } from 'ant-design-vue'; // If not using global registration

const router = useRouter();
const auth = useAuthStore(); // Use your auth store

const navigateToLogin = () => {
  router.push('/login'); // Adjust route as needed
};

const navigateToRegister = () => {
  router.push('/register'); // Adjust route as needed
};

const handleLogout = () => {
  auth.logout();
  router.push('/login'); // Or to home
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.app-header {
  background-color: @header-bg;
  color: @text-color-light;
  height: @layout-header-height;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px #f0f1f2;
  position: sticky;
  top: 0;
  z-index: @zindex-header;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 @spacing-md; // Use variables for padding
    max-width: @content-max-width;
    margin: 0 auto;
  }

  .logo-section {
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: @text-color-light;
    }
    .logo-image {
      height: 32px; // Adjust as needed
      margin-right: @spacing-sm;
    }
    .logo-text {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .navigation {
    .nav-link {
      color: #ccc; // Lighter gray for non-active links
      margin: 0 @spacing-md;
      text-decoration: none;
      padding: 5px 0;
      position: relative; // For active indicator

      &:hover,
      &.router-link-exact-active {
        color: @text-color-light;
      }

      // Active link indicator (optional)
      &.router-link-exact-active::after {
        content: '';
        position: absolute;
        bottom: -5px; // Adjust
        left: 0;
        width: 100%;
        height: 2px;
        background-color: @primary-color;
      }
    }
  }

  .user-actions {
    .action-link {
      color: #ccc;
      margin-left: @spacing-sm;
      &:hover {
        color: @text-color-light;
      }
    }
    .action-button-register {
      margin-left: @spacing-sm;
      background-color: @primary-color;
      border-color: @primary-color;
      &:hover {
        background-color: @primary-color-dark;
        border-color: @primary-color-dark;
      }
    }
    span {
        margin-right: @spacing-sm;
    }
  }
}
</style>