import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 页签配置: key 应该与路由名称或路径片段相关联，方便同步
// path 是点击页签后要跳转的完整路径
const defaultTabsConfig = {
  published: {
    key: 'published',
    label: '我发布的',
    defaultSubTabKey: 'publishedAlternativeSourcing', // 第一个子页签作为默认
    subTabs: [
      { key: 'AlternativeSourcing', label: '国产替代寻源', path: '/user/published/DomesticSourcing' },
      { key: 'OriginalSourcing', label: '原厂件寻源', path: '/user/published/OEMPartsSourcing' },
      { key: 'RndCollaboration', label: '研发攻关', path: '/user/published/PublicRelations' },
      { key: 'TestingValidation', label: '检测验证', path: '/user/published/Verification' },
      { key: 'OfflineEvents', label: '线下活动', path: '/user/published/OfflineEvent' },
      // ... 更多 "我发布的" 子页签
    ],
  },
  join: {
    key: 'join',
    label: '我参与的',
    defaultSubTabKey: 'joinAlternativeSourcing',
    subTabs: [
      { key: 'AlternativeSourcing', label: '国产替代寻源', path: '/user/join/DomesticSourcing' },
      { key: 'OriginalSourcing', label: '原厂件寻源', path: '/user/join/OEMPartsSourcing' },
      { key: 'RndCollaboration', label: '研发攻关', path: '/user/join/PublicRelations' },
      { key: 'TestingValidation', label: '检测验证', path: '/user/join/Verification' },
      { key: 'OfflineEvents', label: '线下活动', path: '/user/join/OfflineEvent' },
      // ... 更多 "我参与的" 子页签
    ],
  },
  userCenter: {
    key: 'userCenter',
    label: '账号管理',
    defaultSubTabKey: 'userCenterInfo',
    subTabs: [
      { key: 'userCenterInfo', label: '会员信息', path: '/user/setting/userCenterInfo' },
      { key: 'userCenterPassword', label: '修改密码', path: '/user/setting/userCenterPassword' },
    ]
  }
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
      activeMainTabKey.value = mainKey;
      const defaultSubKey = tabsConfig[mainKey]?.defaultSubTabKey;
      const firstSubTab = tabsConfig[mainKey]?.subTabs?.[0];
      
      // 导航到该主页签下的第一个子页签或默认子页签
      // const targetSubTabKey = defaultSubKey || (firstSubTab ? firstSubTab.key : null);
      const targetSubTabKey = activeSubTabKey.value || defaultSubKey;
      if (targetSubTabKey) {
        selectSubTab(targetSubTabKey, mainKey); // 明确传递 mainKey
      } else if (firstSubTab && firstSubTab.path) {
         // 如果没有 defaultSubTabKey，但有第一个子页签，则导航到它
        router.push(firstSubTab.path);
      }
      // 如果主页签本身对应一个路由，可以在这里导航
      // else if (tabsConfig[mainKey].path) { router.push(tabsConfig[mainKey].path) }
    }
  };

  const selectSubTab = (subKey, mainKeyOverride) => {
    const mainKeyToUse = mainKeyOverride || activeMainTabKey.value;
    const tabConfig = tabsConfig[mainKeyToUse];
    if (tabConfig && tabConfig.subTabs) {
      const subTab = tabConfig.subTabs.find(st => st.key === subKey);
      if (subTab && subTab.path) {
        activeSubTabKey.value = subKey; // 更新内部状态
        // 只有当目标路径与当前路径不同时才导航，避免冗余导航
        if (route.path !== subTab.path) {
          router.push(subTab.path);
        }
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
    selectSubTab,
  };
}