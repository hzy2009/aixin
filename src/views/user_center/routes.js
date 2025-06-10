// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

const DomesticSourcing = () => import('./views/publications/DomesticSourcing/list.vue'); 
const DomesticEditPage = () => import('./views/publications/DomesticSourcing/edit.vue');
const DomesticDetailPage = () => import('./views/publications/DomesticSourcing/detail.vue');


const OEMPartsSourcing = () =>import('./views/publications/OEMParts/list.vue'); 
const OEMPartsEditPage = () => import('./views/publications/OEMParts/edit.vue'); 
const OEMPartsDetailPage = () => import('./views/publications/OEMParts/detail.vue'); 


const PublicRelations = () =>import('./views/publications/PublicRelations/list.vue'); 
const PublicRelationsDetailPage = () => import('./views/publications/PublicRelations/detail.vue');
const PublicRelationsEditPage = () => import('./views/publications/PublicRelations/edit.vue');



const Verification = () =>import('./views/publications/Verification/list.vue'); 
const VerificationDetailPage = () => import('./views/publications/Verification/detail.vue');
const VerificationEditPage = () => import('./views/publications/Verification/edit.vue');



const OfflineEvent = () =>import('./views/publications/OfflineEvent/list.vue'); 
const OfflineEventDetailPage = () => import('./views/publications/OfflineEvent/detail.vue');
const OfflineEventEditPage = () => import('./views/publications/OfflineEvent/edit.vue');


const userCenterRoutes = [
  {
    path: '/user/published', // “我发布的” 的父路由
    component: UserCenterCommonLayout, // 使用新的通用顶部布局
    meta: { requiresAuth: true },
    redirect: '/user/published/DomesticSourcing', // 默认跳转到第一个子页签
    children: [
      {
        path: 'DomesticSourcing', // 相对路径
        component: DomesticSourcing, // 这个页面现在是子路由
        meta: { title: '我发布的 - 国产替代寻源' }
      },
      {
        path: 'DomesticSourcing/detail/:id', 
        component: DomesticDetailPage, 
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '国产替代寻源', breadcrumb: ['国产替代寻源'] }
      },
      {
        path: 'DomesticSourcing/create', 
        component: DomesticEditPage, 
        meta: { title: '创建国产替代寻源需求', breadcrumb: ['创建国产替代寻源需求'] }
      },


      {
        path: 'OEMPartsSourcing',
        component: OEMPartsSourcing, 
        meta: { title: '我发布的 - 原厂件寻源' }
      },
      {
        path: 'OEMPartsSourcing/create', 
        component: OEMPartsEditPage, 
        meta: { title: '创建原厂件寻源需求', breadcrumb: ['创建原厂件寻源需求'] }
      },
      {
        path: 'OEMPartsSourcing/detail/:id', 
        component: OEMPartsDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '原厂件寻源详情', breadcrumb: ['原厂件寻源详情'] }
      },

      {
        path: 'PublicRelations',
        component: PublicRelations,
        meta: { title: '我发布的 - 研发攻关' }
      },
      {
        path: 'PublicRelations/create', 
        component: PublicRelationsEditPage,
        meta: { title: '创建研发攻关', breadcrumb: ['创建研发攻关需求'] }
      },
      {
        path: 'PublicRelations/detail/:id', 
        component: PublicRelationsDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '研发攻关需求详情', breadcrumb: [ '研发攻关需求详情'] }
      },
      {
        path: 'Verification',
        component: Verification,
        meta: { title: '我发布的 - 检测验证' }
      },
       {
        path: 'Verification/create', 
        component: VerificationEditPage, 
        meta: { title: '创建检测验证需求', breadcrumb: [ '创建检测验证需求'] }
      },
      {
        path: 'Verification/detail/:id', 
        component: VerificationDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: [ '检测验证需求详情'] }
      },
      {
        path: 'OfflineEvent',
        component: OfflineEvent,
        meta: { title: '我发布的 - 线下活动' }
      },
      {
        path: 'OfflineEvent/create',
        component: OfflineEventEditPage,
        meta: { title: '创建线下活动' }
      },
      {
        path: 'OfflineEvent/detail/:id',
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        component: OfflineEventDetailPage,
        meta: { title: '创建线下活动' }
      },
    ]
  },
  // {
  //   path: '/user/participated', // “我参与的” 的父路由
  //   component: UserCenterCommonLayout,
  //   meta: { requiresAuth: true },
  //   redirect: '/user/participated/demands',
  //   children: [
  //     {
  //       path: 'demands',
  //       name: 'ParticipatedDemands',
  //       component: () => import('./views/MyParticipatedDemandsPage.vue'), // 需要创建
  //       meta: { title: '我参与的需求' }
  //     },
  //     // ... 其他 "我参与的" 子路由
  //   ]
  // },
  // ... 其他顶层用户中心路由 ...
];

export default userCenterRoutes;