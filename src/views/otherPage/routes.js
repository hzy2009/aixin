// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

const membershipGuide = () => import('./membershipGuide/index.vue'); 
const platformMember = () => import('./platformMember/index.vue');
const tongyongcaiji = () => import('./tongyongcaiji/index.vue');

const userCenterRoutes = [
  {
    path: '/other', // “我发布的” 的父路由
    component: UserCenterCommonLayout, // 使用新的通用顶部布局
    meta: { requiresAuth: true },
    redirect: '/membershipGuide', // 默认跳转到第一个子页签
    children: [
      {
        path: 'membershipGuide', // 相对路径
        component: membershipGuide, // 这个页面现在是子路由
        meta: { title: '入会指南', breadcrumb: ['入会指南'] }
      },
      {
        path: 'platformMember', 
        component: platformMember, 
        meta: { title: '平台会员', breadcrumb: ['平台会员'] }
      },
       {
        path: 'tongyongcaiji', 
        component: tongyongcaiji, 
        meta: { title: '通用件集采', breadcrumb: ['通用件集采'] }
      },
    ]
  },
  
];

export default userCenterRoutes;