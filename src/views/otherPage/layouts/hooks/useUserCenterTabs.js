import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 页签配置: key 应该与路由名称或路径片段相关联，方便同步
// path 是点击页签后要跳转的完整路径
const defaultTabsConfig = {
  membershipGuide: {
    key: 'membershipGuide',
    label: '入会指南',
    defaultSubTabKey: 'membershipGuide', // 第一个子页签作为默认
    path: '/other/membershipGuide',
  },
  platformMember: {
    key: 'platformMember',
    label: '平台会员',
    defaultSubTabKey: 'platformMember',
    path: '/other/platformMember',
  },
//  tongyongcaiji: {
//     key: 'tongyongcaiji',
//     label: '通用件集采',
//     defaultSubTabKey: 'tongyongcaiji',
//     path: '/other/tongyongcaiji',
//   },
};

export function useUserCenterTabs(tabsConfig = defaultTabsConfig) {
  const route = useRoute();
  const router = useRouter();

  const activeMainTabKey = ref(Object.keys(tabsConfig)[0]); // 默认激活第一个主页签
  const activeSubTabKey = ref(tabsConfig[activeMainTabKey.value]?.defaultSubTabKey || '');
  const mainTabs = computed(() => {
    return Object.values(tabsConfig).map(tab => ({
      key: tab.key,
      label: tab.label,
    }));
  });
  console.log('mainTabs', mainTabs);

  const currentSubTabs = computed(() => {
    return tabsConfig[activeMainTabKey.value]?.subTabs || [];
  });

  const selectMainTab = (mainKey) => {
    if (activeMainTabKey.value !== mainKey) {
      const path = tabsConfig[mainKey]?.path;
      if (path) {
        router.push({ path });
      }
    }
  };
  
  // 根据当前路由路径同步激活的页签
  const syncTabsWithRoute = (currentPath) => {
    for (const mainKey in tabsConfig) {
      const mainTabData = tabsConfig[mainKey];
      if (mainTabData.subTabs) {
        for (const subTab of mainTabData.subTabs) {
          // 如果当前路径以子页签路径开头，则认为匹配 (更精确的匹配可能需要基于路由名称)
          if (currentPath.startsWith(subTab.path) || currentPath.startsWith(`${subTab.path}/create`)) {
            activeMainTabKey.value = mainKey;
            activeSubTabKey.value = subTab.key;
            return; // 找到匹配项后即返回
          }
        }
      }
      // 如果主页签本身有路径且匹配 (不常见于这种两级结构)
      // else if (mainTabData.path && currentPath.startsWith(mainTabData.path)) {
      //   activeMainTabKey.value = mainKey;
      //   activeSubTabKey.value = ''; // 没有子页签被激活
      //   return;
      // }
    }
    console.log('没有匹配的子页签');
    // 如果没有子页签匹配，但路径可能属于某个主页签的根 (例如 /user/published/)
    // 则激活主页签，并尝试激活其默认子页签
    const pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length >= 2) { // e.g., ['user', 'published']
        const potentialMainKey = pathSegments[1];
        if (tabsConfig[potentialMainKey]) {
            activeMainTabKey.value = potentialMainKey;
            activeSubTabKey.value = tabsConfig[potentialMainKey].defaultSubTabKey || tabsConfig[potentialMainKey]?.subTabs?.[0]?.key || '';
        }
    }

  };

  // 监听路由变化
  watch(
    () => route.path,
    (newPath) => {
      syncTabsWithRoute(newPath);
    },
    { immediate: true } // 立即执行以设置初始状态
  );

  return {
    activeMainTabKey,
    activeSubTabKey,
    mainTabs,
    currentSubTabs,
    selectMainTab,
  };
}