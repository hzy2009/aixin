// src/features/industryDynamics/routes.js
const industryDynamicsRoutes = [
  {
    path: '/industry-dynamics', // Main page for the list
    name: 'IndustryDynamics',
    component: () => import('@/features/industryDynamics/views/IndustryDynamicsPage.vue'),
    meta: { title: '行业动态 - 爱芯享信息共享平台' }
  },
  // Example for a detail page (you'll create this later)
  // {
  //   path: '/industry-dynamics/:id',
  //   name: 'IndustryDynamicDetail',
  //   component: () => import('@/features/industryDynamics/views/IndustryDynamicDetailPage.vue'),
  //   meta: { title: '动态详情 - 爱芯享信息共享平台' }
  // }
];

export default industryDynamicsRoutes;