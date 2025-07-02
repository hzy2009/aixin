<template>
  <div class="user-center-sidebar">
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" :theme="sidebarTheme"
      :items="menuItems" @click="handleMenuClick" />
  </div>
</template>

<script setup lang="jsx">
import { ref, watch, computed, h } from 'vue'; // Import h
import { useRouter, useRoute } from 'vue-router';
import { Menu as AMenu } from 'ant-design-vue';
import {
  UserOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BellOutlined,
} from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

const props = defineProps({
  sidebarTheme: {
    type: String,
    default: 'light',
  },
});

const router = useRouter();
const route = useRoute();

// Define menu structure using Vue's h function for icons
const menuItems = computed(() => [
  {
    key: 'userInfoParent',
    label: '账户管理',
    icon: () => h(UserOutlined),
    children: [
      { key: 'UserMemberInfo', label: '会员信息', path: '/user/info/member' },
      { key: 'UserAccountSettings', label: '用户管理', path: '/user/info/settings' },
    ],
    isLogIn: true
  },
  {
    key: 'userDemands', // Parent key
    label: '需求广场',
    icon: () => h(AppstoreOutlined), // Or relevant icon
    children: [
      { key: 'DomesticSourcing', label: '多元化寻源', path: '/user/published/DomesticSourcing' },
      { key: 'OEMPartsSourcing', label: '原厂件寻源', path: '/user/published/OEMPartsSourcing' },
      { key: 'PublicRelations', label: '研发攻关', path: '/user/published/PublicRelations' },
      { key: 'Verification', label: '检测验证', path: '/user/published/Verification' },
    ],
  },
  {
    key: 'publicationsParent',
    label: '我发布的',
    icon: () => h(FileTextOutlined),
    children: [
      { key: 'MyDomesticSourcing', label: '多元化寻源', path: '/user/publications/MyDomesticSourcing' },
      { key: 'MyOEMPartsSourcing', label: '原厂件寻源', path: '/user/publications/MyOEMPartsSourcing' },
      { key: 'MyPublicRelations', label: '研发攻关', path: '/user/publications/MyPublicRelations' },
      { key: 'MyVerification', label: '检测验证', path: '/user/publications/MyVerification' },
    ],
    isLogIn: true
  },
  {
    key: 'UserMessageCenter', // Direct link
    label: '消息中心',
    icon: () => h(BellOutlined),
    path: '/user/messages',
    isLogIn: true
  },
].filter(item => {
  if (!authStore.token && item.isLogIn) {
    return false
  }
  return true
})
);


const selectedKeys = ref([]);
const openKeys = ref([]);

// Helper to find parent key for a given child route name/key
const getParentKey = (childKey, items) => {
  for (const item of items) {
    if (item.children && item.children.some(child => child.key === childKey)) {
      return item.key;
    }
  }
  return null;
};

// Watch route changes to update selected keys and open parent submenus
watch(
  () => route.name,
  (currentRouteName) => {
    if (currentRouteName) {
      const currentKey = currentRouteName.toString();
      selectedKeys.value = [currentKey];

      // Attempt to open the parent submenu
      const parentKey = getParentKey(currentKey, menuItems.value);
      if (parentKey) {
        // If the parent is not already open, open it.
        // This avoids closing other open submenus unnecessarily if you want multiple open.
        if (!openKeys.value.includes(parentKey)) {
          openKeys.value = [...openKeys.value, parentKey];
        }
      } else {
        // If it's a top-level item, you might want to close all submenus,
        // or keep them open based on desired UX.
        // For now, we don't close them if they were already open.
        // If you want only one parent open at a time:
        // openKeys.value = [];
      }
    }
  },
  { immediate: true }
);

// Handle multiple open submenus (optional, AntD default is one at a time for inline mode)
// If you want to allow multiple submenus to be open:
// const onOpenChange = currentOpenKeys => {
//   openKeys.value = currentOpenKeys;
// };
// Then bind :onOpenChange="onOpenChange" to a-menu.
// For now, we manage openKeys primarily through route changes.

const handleMenuClick = ({ key, item }) => {
  // `item.props.path` comes from our custom `path` property in the menuItems structure
  // `key` is the route name if path is not explicitly defined
  const targetPath = item?.path ? { path: item?.path } : { name: key };
  if (targetPath) {
    router.push(targetPath);
  }
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-center-sidebar {
  height: 100%;

  :deep(.ant-menu) {
    height: 100%;
    border-right: none !important;
  }

  :deep(.ant-menu-item),
  :deep(.ant-menu-submenu-title) {
    font-size: 14px;
  }

  // Optional: if you want a very specific selected style
  :deep(.ant-menu-light .ant-menu-item-selected) {
    // background-color: fade(@primary-color, 8%) !important;
    // color: @primary-color !important;
    // &::after {
    //   border-right-color: @primary-color !important;
    // }
  }

  :deep(.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title) {
    // color: @primary-color !important;
  }
}
</style>