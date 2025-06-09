import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export function useNavigation() {
  const route = useRoute();

  // Define all main navigation items here
  // `path` is the target route.
  // `matchPaths` can be an array of paths or path prefixes for determining active state,
  // especially for parent items that group several sub-pages.
  // `requiresAuth` and `requiresGuest` can be used to conditionally show links.
  const navigationItems = ref([
    { key: 'home', label: '首页', path: '/', matchPaths: ['/'] },
    { key: 'industryDynamics', label: '行业动态', path: '/industry-dynamics', matchPaths: ['/industry-dynamics'] },
    { key: 'alternativeSourcing', label: '国产替代寻源', path: '/demands/DomesticSourcing', queryParams: { type: 'DomesticSourcing'}, basePath: '/demand' },
    { key: 'originalSourcing', label: '原厂件寻源', path: '/demands/OEMPartsSourcing', queryParams: { type: 'OEMPartsSourcing'}, basePath: '/demand' },
    { key: 'rndCollaboration', label: '研发攻关', path: '/demands/PublicRelations', queryParams: { type: 'PublicRelations'}, basePath: '/demand' },
    { key: 'testingValidation', label: '检测验证', path: '/demands/Verification', queryParams: { type: 'Verification'}, basePath: '/demand' },
    { key: 'offlineEvents', label: '线下活动', path: '/demands/OfflineEvent', queryParams: { type: 'offlineEvents'}, basePath: '/demand' },
    { key: 'industryReport', label: '行业报告', path: '/demands/IndustryReport', queryParams: { type: 'industryReport'}, basePath: '/demand' },
    { key: 'industryTalent', label: '行业人才', path: '/demands/Talent', queryParams: { type: 'industryTalent'}, basePath: '/demand' },
    { key: 'techForum', label: '技术论坛', path: '/tech-forum', matchPaths: ['/tech-forum'] },
    // Add more items as needed
  ]);

  const isActiveNavItem = (navItem) => {
    // Exact path match
    if (route.path === navItem.path && !navItem.queryParams) return true;

    // Base path match for items with query params (like demand square types)
    if (navItem.basePath && route.path === navItem.basePath) {
        if (navItem.queryParams) {
            return Object.entries(navItem.queryParams).every(([key, value]) => route.query[key] === value);
        }
        return true; // If no specific query params to match for this basePath item, just path match
    }

    // Match against provided matchPaths (for more complex scenarios)
    if (navItem.matchPaths && navItem.matchPaths.some(p => route.path.startsWith(p))) {
      return true;
    }
    return false;
  };

  // You can add computed properties here to filter navigationItems based on auth state
  // For example:
  // const visibleNavigationItems = computed(() => {
  //   const authStore = useAuthStore(); // Assuming you have access to it
  //   return navigationItems.value.filter(item => {
  //     if (item.requiresAuth && !authStore.isAuthenticated) return false;
  //     if (item.requiresGuest && authStore.isAuthenticated) return false;
  //     return true;
  //   });
  // });

  return {
    navigationItems, // Or visibleNavigationItems if you implement filtering
    isActiveNavItem,
  };
}