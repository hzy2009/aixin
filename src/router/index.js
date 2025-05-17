// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
// Import feature routes later
// import authRoutes from '@/features/auth/routes';
import homeRoutes from '@/features/home/routes'; // Import home feature routes

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      ...homeRoutes, // Spread home feature routes
      // ... other feature routes that use DefaultLayout
    ],
  },
  // Example for a route without the default layout (e.g., Login page)
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/features/auth/views/LoginPage.vue')
  // },
  {
    path: '/:pathMatch(.*)*', // Catch-all 404
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'), // Create this simple component
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation Guards (for role-based access - implement later)
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore(); // Be careful, store might not be initialized yet
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({ name: 'Login' });
//   } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
//     next({ name: 'Forbidden' }); // Or redirect to home
//   } else {
//     next();
//   }
// });

export default router;