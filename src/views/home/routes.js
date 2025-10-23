// src/features/home/routes.js
const homeRoutes = [
  {
    path: '', // Empty path for the root of the parent layout
    name: 'Home',
    component: () => import('@/views/home/views/HomePage.vue'),
    meta: { title: '首页 - 爱芯享电子信息服务平台' } // Example meta for document title
  }
];

export default homeRoutes;