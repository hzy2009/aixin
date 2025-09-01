// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/components/layout/DefaultLayout.vue';

import homeRoutes from '@/views/home/routes';
import authRoutes from '@/views/auth/routes';
import demandsRoutes from '@/views/demand_square/demands/routes/index';
import industryDynamicsRoutes from '@/views/industryDynamics/routes';
import rdDynamicRoutes from '@/views/rdDynamic/routes';
import userCenterRoutes from '@/views/user_center/routes';
import otherPageRoutes from '@/views/otherPage/routes';
import secondTradeRoutes from '@/views/secondTrade/routes';

const tongyongcaiji = () => import('@/views/otherPage/tongyongcaiji/index.vue');
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { useLoadingStore } from '@/store/loadingStore';
import progressBar from '@/utils/progressBar';

import { message } from 'ant-design-vue';
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      ...homeRoutes,
      ...demandsRoutes, // 推荐所有路由模块都导出数组
      ...userCenterRoutes,
      ...otherPageRoutes,
      ...industryDynamicsRoutes,
      ...rdDynamicRoutes,
      ...secondTradeRoutes,
      {
        path: 'other/tongyongcaiji', 
        component: tongyongcaiji, 
        meta: { title: '通用件集采', breadcrumb: ['通用件集采'] }
      },
      // ... other feature routes that use DefaultLayout
    ],
  },
  ...authRoutes,
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: '页面未找到' }
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

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 开始进度条和全局loading
  progressBar.start();
  const loadingStore = useLoadingStore();
  loadingStore.startRouteLoading();

  const authStore = useAuthStore();
  const isLogin = authStore.isLogin;

  // 设置页面标题
  document.title = to.meta.title || '爱芯享集成电路信息共享平台';
  // 检查目标路由是否需要认证
  if (to.meta.requiresAuth) {
    if (isLogin) {
      // 用户已登录，检查角色权限
      const {roleCode} = authStore.userRole;
      const requiredRoles = [
        ...to?.meta?.roles || [],
        'apm-super-vip-free',
        'apm-super-vip'
      ];

      if (requiredRoles && requiredRoles.length > 0) {
        // 页面需要特定角色
        const hasPermission = requiredRoles.includes(roleCode);
        if (hasPermission) {
          next(); // 角色匹配，放行
        } else {
          message.error('您没有权限访问此页面');
        }
      } else {
        // 页面只需登录，不限角色
        next();
      }
    } else {
      // 用户未登录，重定向到登录页
      // next({
      //   name: 'Login', // 确保你的登录页路由 name 是 'Login'
      //   query: { redirect: to.fullPath }, // 登录后可以重定向回来
      // });
      const modalStore = useModalStore();
      modalStore.showLogin();
      progressBar.finish();
      const loadingStore = useLoadingStore();
      loadingStore.finishRouteLoading();
    }
  } else {
     // 如果用户已登录，且尝试访问“仅访客”页面（如登录页），则重定向到首页
    // if (to.meta.guestOnly && isLogin) {
    //     next({ name: 'Home' }); // 假设首页 name 是 'Home'
    // } else {
    //     // 页面无需认证，直接放行
    //     next();
    // }
    next();
  }
});

// 路由完成后的钩子
router.afterEach((to, from) => {
  // 完成进度条和全局loading
  progressBar.finish();
  const loadingStore = useLoadingStore();
  loadingStore.finishRouteLoading();
});

// 路由错误处理
router.onError((error) => {
  // 出错时显示错误状态的进度条和停止loading
  progressBar.error();
  const loadingStore = useLoadingStore();
  loadingStore.stopRouteLoading();
  console.error('路由错误:', error);
});

export default router;