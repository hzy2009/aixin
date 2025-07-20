// src/features/industryDynamics/routes.js
const industryDynamicsRoutes = [
  {
    path: '/industry-dynamics', // Main page for the list
    name: 'IndustryDynamics',
    component: () => import('@/views/industryDynamics/views/IndustryDynamicsPage.vue'),
    meta: { title: '行业热点 - 爱芯享集成电路信息共享平台', requiresAuth: false }
  },
  {
    path: '/industry-dynamics/:id',
    name: 'IndustryDynamicDetail',
    props: route => ({ id: route.params.id}),
    component: () => import('@/views/industryDynamics/views/IndustryDynamicDetailPage.vue'),
    meta: { title: '动态详情 - 爱芯享集成电路信息共享平台', requiresAuth: true, roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
  }
];

export default industryDynamicsRoutes;