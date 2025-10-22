// src/features/rdDynamic/routes.js
const rdDynamicRoutes = [
  {
    path: '/rd-dynamics', // Main page for the list
    name: 'rdDynamic',
    component: () => import('@/views/rdDynamic/views/rdDynamicPage.vue'),
    meta: { title: '定制开发动态 - 爱芯享信息服务平台', requiresAuth: false, requiresSecondaryVerification: true }
  },
  {
    path: '/rd-dynamics/:id',
    name: 'rdDynamicDetail',
    props: route => ({ id: route.params.id }),
    component: () => import('@/views/rdDynamic/views/rdDynamicDetailPage.vue'),
    meta: { title: '动态详情 - 爱芯享信息服务平台', requiresAuth: true, roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
  }
];

export default rdDynamicRoutes;