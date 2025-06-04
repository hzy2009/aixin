// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import homeRoutes from '@/views/home/routes';
import authRoutes from '@/views/auth/routes'; // <-- Import
import demandsRoutes from '@/views/demand_square/demands/routes.js'; // Import new routes
import industryDynamicsRoutes from '@/views/industryDynamics/routes'; // <-- Import
import userCenterRoutes from '@/views/user_center/routes';

import { useAuthStore } from '@/store/authStore'; // Import for navigation guard

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      ...homeRoutes,
      demandsRoutes,
      ...industryDynamicsRoutes,
      // ... other feature routes that use DefaultLayout
    ],
  },
  // ...userCenterRoutes, 
  ...authRoutes, // <-- Add auth routes (they don't use DefaultLayout)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

// Example Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Get store instance here

  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '爱芯享信息共享平台'; // Default title
  }
    next();

  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next({ name: 'Login', query: { redirect: to.fullPath } });
  // } else if (to.meta.guestOnly && authStore.isAuthenticated) {
  //   next({ name: 'Home' }); // Or dashboard if they are admin/member
  // } else {
  //   next();
  // }
});

export default router;