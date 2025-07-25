// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

const oemParts = () => import('./views/oemParts/index.vue'); 
const standard = () => import('./views/standard/index.vue');
const notStandard = () => import('./views/notStandard/index.vue');
const usedEqpTrade = () => import('./views/usedEqpTrade/index.vue');

const userCenterRoutes = [
  {
    path: '/secondTrade', 
    component: UserCenterCommonLayout, // 使用新的通用顶部布局
    redirect: '/oemParts', // 默认跳转到第一个子页签
    children: [
      {
        path: 'oemParts', // 相对路径
        component: oemParts, // 这个页面现在是子路由
        meta: { title: '原厂件库存处理', breadcrumb: ['原厂件库存处理'] }
      },
      {
        path: 'standard', 
        component: standard, 
        meta: { title: '标准件库存处理', breadcrumb: ['标准件库存处理'] }
      },
      {
        path: 'notStandard',
        component: notStandard,
        meta: { title: '非标准件库存处理', breadcrumb: ['非标准件库存处理'] }
      },
      {
        path: 'usedEqpTrade',
        component: usedEqpTrade,
        meta: { title: '二手设备交易', breadcrumb: ['二手设备交易'] }
      }
    ]
  },
  
];

export default userCenterRoutes;