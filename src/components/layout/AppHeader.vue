<template>
  <header class="app-header">
    <!-- Left Side - Outside Container -->
    <div class="header-side header-side--left">
      <router-link to="/" class="logo-link">
        <span class="logo-brand">LOGO</span>
        <span class="logo-text">爱芯享信息共享平台</span>
      </router-link>
    </div>

    <!-- Center Navigation - Inside Container -->
    <nav class="navigation-container container" role="navigation" aria-label="Main navigation">
      <router-link to="/" class="nav-link" exact-active-class="nav-link--active">首页</router-link>
      <router-link to="/industry-dynamics" class="nav-link" active-class="nav-link--active">行业动态</router-link>
      <router-link to="/user/demands/DomesticSourcing" class="nav-link"
        active-class="nav-link--active">需求广场</router-link>
      <router-link to="/tech-forum" class="nav-link" active-class="nav-link--active">技术论坛</router-link>
    </nav>

    <!-- Right Side - Outside Container -->
    <div class="header-side header-side--right">
      <div class="user-actions">
        <template v-if="auth.userInfo">
          <a-dropdown placement="bottomRight">
            <a class="user-action-link user-greeting" @click.prevent>
              你好, {{ auth.userInfo?.realname }}
              <DownOutlined style="font-size: 12px; margin-left: 4px;" />
            </a>
            <template #overlay>
              <a-menu>
                <!-- <a-menu-item key="profile">
                  <router-link to="/user/profile">个人中心</router-link>
                </a-menu-item> -->
                <!-- <a-menu-divider /> -->
                <a-menu-item key="logout" @click="handleLogout">
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="user-action-link login-link">会员登录</router-link>
          <router-link to="/register" class="user-action-link register-link">会员注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { Dropdown as ADropdown, Menu as AMenu, MenuItem as AMenuItem, MenuDivider as AMenuDivider } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
  router.push('/');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.app-header {
  background-color: @background-color-base;
  height: @layout-header-height; // e.g., 60px
  display: flex;
  align-items: center;
  justify-content: space-between; // Pushes left/right sides to edges, nav centers
  // border-bottom: 1px solid @border-color-light;
  position: sticky;
  top: 0;
  z-index: @zindex-header;
  width: 100%;
  padding: 0 @content-padding-horizontal; // Default padding for the edges if needed, but sides handle their own
}

.header-side {
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;

  &--left {
    // No specific justification needed, items will align left by default
  }

  &--right {
    // No specific justification needed, items will align right by default within this div
  }
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: @text-color-base;
  // Removed margin-left: @content-padding-horizontal; as the .app-header padding handles edge spacing

  .logo-brand {
    font-size: 22px;
    font-weight: 600;
    margin-right: 8px;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
  }
}

.navigation-container {
  // .container styles (max-width, margin: auto) are applied globally via the class
  // This element itself should NOT have horizontal padding, as it's the '版心'
  // The router-links inside it will have padding.
  padding-left: 0 !important; // Override container's default padding
  padding-right: 0 !important; // Override container's default padding
  display: flex;
  align-items: center;
  justify-content: flex-start; // Navigation items start from the left of the container
  height: 100%;
  flex-grow: 1; // Allow navigation to take up available space in the middle
  overflow: hidden; // Prevent nav links from causing overflow if too many
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: @layout-header-height;
  padding: 0 44px; // Padding *inside* each link
  text-decoration: none;
  font-size: 15px;
  color: @text-color-secondary;
  background-color: transparent;
  border: none;
  transition: color 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
  position: relative; // For the ::after pseudo-element

  &:hover {
    background-color: @primary-color;
    color: @text-color-light !important;
  }

  // Active state styling from the image (red background for "首页")
  &.nav-link--active {
    background-color: @primary-color;
    color: @text-color-light !important;
    font-weight: 500;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  height: 100%;
  // margin-right: @content-padding-horizontal; // Handled by .app-header padding
}

.user-action-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: @layout-header-height;
  padding: 0 22px;
  text-decoration: none;
  font-size: 15px;
  border: none;
  background-color: transparent;
  transition: color 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
}

.login-link {
  color: @text-color-secondary;

  &:hover {
    background-color: @primary-color;
    color: @text-color-light;
    font-weight: 500;
  }
}

.register-link {
  background-color: @primary-color;
  color: @text-color-light;
  font-weight: 500;

  &:hover {
    color: @text-color-secondary;
    background-color: @background-color-base;
  }
}

.user-greeting {
  color: @text-color-secondary;
  cursor: pointer;

  &:hover {
    color: @primary-color;
  }
}

// Ant Design Dropdown Menu Styling
:deep(.ant-dropdown-menu) {
  .ant-dropdown-menu-item {
    font-size: 14px;

    a {
      color: @text-color-base;
    }

    &:hover {
      background-color: lighten(@primary-color, 40%);

      a {
        color: @primary-color;
      }
    }
  }

  .ant-dropdown-menu-item-divider {
    margin: 4px 0;
  }
}
</style>