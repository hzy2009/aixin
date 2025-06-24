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
    { key: 'industryDynamics', label: '行业热点', path: '/industry-dynamics', matchPaths: ['/industry-dynamics'] },
    { key: 'alternativeSourcing', label: '国产替代寻源', path: '/demands/DomesticSourcing', queryParams: { type: 'DomesticSourcing'}, basePath: '/demand',
      subItems: [
        { key: 'demand_squareDomesticSourcing', label: '需求广场', path: '/demands/DomesticSourcing', basePath: '/demand' },
        { key: 'publishedDomesticSourcing', label: '我发布的', path: '/user/published/DomesticSourcing', basePath: '/demand' },
        { key: 'joinDomesticSourcing', label: '我参与的', path: '/user/join/DomesticSourcing', basePath: '/demand' },
        { key: 'createDomesticSourcing', label: '创建国产替代寻源', path: '/user/published/DomesticSourcing/create', basePath: '/demand' },
      ] 
    },
    { key: 'originalSourcing', label: '原厂件寻源', path: '/demands/OEMPartsSourcing', queryParams: { type: 'OEMPartsSourcing'}, basePath: '/demand',
      subItems: [
        { key: 'demand_squareOEMPartsSourcing', label: '需求广场', path: '/demands/OEMPartsSourcing', basePath: '/demand' },
        { key: 'publishedDomesticSourcing', label: '我发布的', path: '/user/published/OEMPartsSourcing', basePath: '/demand' },
        { key: 'joinOEMPartsSourcing', label: '我参与的', path: '/user/join/OEMPartsSourcing', basePath: '/demand' },
        { key: 'createOEMPartsSourcing', label: '创建原厂件寻源', path: '/user/published/OEMPartsSourcing/create', basePath: '/demand' },
      ] 
    },
    { key: 'tongyongcaiji', label: '通用采集', fn: (router, message) => { 
      // const v = router
      // v.push({path: '/tech-forum'})
      message.info('网站建设中，敬请期待')
    } },
    { key: 'rndCollaboration', label: '研发攻关', path: '/demands/PublicRelations', queryParams: { type: 'PublicRelations'}, basePath: '/demand',
      subItems: [
        { key: 'demand_squarePublicRelations', label: '需求广场', path: '/demands/PublicRelations', basePath: '/demand' },
        { key: 'publishedPublicRelations', label: '我发布的', path: '/user/published/PublicRelations', basePath: '/demand' },
        { key: 'joinPublicRelations', label: '我参与的', path: '/user/join/PublicRelations', basePath: '/demand' },
        { key: 'createPublicRelations', label: '创建研发攻关', path: '/user/published/PublicRelations/create', basePath: '/demand' },
      ] 
    },
    { key: 'testingValidation', label: '检测验证', path: '/demands/Verification', queryParams: { type: 'Verification'}, basePath: '/demand',
      subItems: [
        { key: 'demand_squareVerification', label: '需求广场', path: '/demands/Verification', basePath: '/demand' },
        { key: 'publishedVerification', label: '我发布的', path: '/user/published/Verification', basePath: '/demand' },
        { key: 'joinVerification', label: '我参与的', path: '/user/join/Verification', basePath: '/demand' },
        { key: 'createVerification', label: '创建检测验证', path: '/user/published/Verification/create', basePath: '/demand' },
      ]
  },
    { key: 'offlineEvents', label: '线下活动', path: '/demands/OfflineEvent', queryParams: { type: 'offlineEvents'}, basePath: '/demand',
      subItems: [
        { key: 'demand_squareOfflineEvent', label: '需求广场', path: '/demands/OfflineEvent', basePath: '/demand' },
        { key: 'publishedOfflineEvent', label: '我发布的', path: '/user/published/OfflineEvent', basePath: '/demand' },
        { key: 'joinOfflineEvent', label: '我参与的', path: '/user/join/OfflineEvent', basePath: '/demand' },
        { key: 'createOfflineEvent', label: '创建线下活动', path: '/user/published/OfflineEvent/create', basePath: '/demand' },
      ]
    },
    { key: 'industryReport', label: '行研报告', path: '/demands/IndustryReport', queryParams: { type: 'industryReport'}, basePath: '/demand' },
    { key: 'industryTalent', label: '行业人才', path: '/demands/Talent', queryParams: { type: 'industryTalent'}, basePath: '/demand' },
    { key: 'techForum', label: '技术论坛', fn: (router, message) => { 
      // const v = router
      // v.push({path: '/tech-forum'})
      message.info('网站建设中，敬请期待')
    } },
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