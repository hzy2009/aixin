// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

const oemParts = () => import('./views/oemParts/index.vue'); 
const oemPartsDetailPage = () => import('./views/oemParts/detail.vue');
const oemPartsEditPage = () => import('../user_center/views/publications/secondTrade/oemParts/edit.vue');
const standard = () => import('./views/standard/index.vue');
const notStandard = () => import('./views/notStandard/index.vue');
const usedEqpTrade = () => import('./views/usedEqpTrade/index.vue');
const secondTradeDetailPage = () => import('./views/usedEqpTrade/detail.vue');

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
        path: 'oemParts/details/:id',
        component: oemPartsDetailPage,
        props: route => ({ IdProp: route.params.id}),
        meta: { title: '原厂件库存处理详情', breadcrumb: ['原厂件库存处理详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register']  } // Appends to base
      },
      {
        path: 'standard', 
        component: standard, 
        meta: { title: '标准件库存处理', breadcrumb: ['标准件库存处理'] }
      },
      {
        path: 'notStandard',
        component: notStandard,
        meta: { title: '非标件库存处理', breadcrumb: ['非标件库存处理'] }
      },
      {
        path: 'usedEqpTrade',
        component: usedEqpTrade,
        meta: { title: '二手设备交易', breadcrumb: ['二手设备交易'] }
      },
      {
        path: 'usedEqpTrade/details/:id',
        component: secondTradeDetailPage,
        props: route => ({ IdProp: route.params.id}),
        meta: { title: '二手设备交易详情', breadcrumb: ['二手设备交易详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register']  } // Appends to base
      },
    ]
  },
  
];

export default userCenterRoutes;