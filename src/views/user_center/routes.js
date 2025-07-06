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





const joinDomesticSourcing = () => import('./views/join/DomesticSourcing/list.vue'); 
const joinDomesticSourcingDetailPage = () => import('./views/join/DomesticSourcing/detail.vue'); 


const joinOEMPartsSourcing = () =>import('./views/join/OEMParts/list.vue'); 
const joinOEMPartsDetailPage = () =>import('./views/join/OEMParts/detail.vue'); 


const joinPublicRelations = () =>import('./views/join/PublicRelations/list.vue'); 
const joinPublicRelationsDetailPage = () =>import('./views/join/PublicRelations/detail.vue'); 



const joinVerification = () =>import('./views/join/Verification/list.vue'); 
const joinVerificationDetailPage = () =>import('./views/join/Verification/detail.vue'); 



const joinOfflineEvent = () =>import('./views/join/OfflineEvent/list.vue'); 
const JoinOfflineEventDetailPage = () => import('./views/join/OfflineEvent/detail.vue');


const MemberInfoPage = () => import('./views/userInfo/MemberInfoPage/index.vue');
const passWordPage = () => import('./views/userInfo/passWord/index.vue');
const todoList = () => import('./views/todo/index.vue');


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
        meta: { title: '我发布的 - 多元化寻源' }
      },
      {
        path: 'DomesticSourcing/detail/:id', 
        component: DomesticDetailPage, 
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '多元化寻源', breadcrumb: ['多元化寻源'] }
      },
      {
        path: 'DomesticSourcing/create', 
        component: DomesticEditPage, 
        meta: { title: '创建多元化寻源需求', breadcrumb: ['创建多元化寻源需求'] }
      },


      {
        path: 'OEMPartsSourcing',
        component: OEMPartsSourcing, 
        meta: { title: '我发布的 - 原厂件寻源', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OEMPartsSourcing/create', 
        component: OEMPartsEditPage, 
        meta: { title: '创建原厂件寻源需求', breadcrumb: ['创建原厂件寻源需求'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OEMPartsSourcing/detail/:id', 
        component: OEMPartsDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '原厂件寻源详情', breadcrumb: ['原厂件寻源详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
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
        meta: { title: '研发攻关需求详情', breadcrumb: [ '研发攻关需求详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'Verification',
        component: Verification,
        meta: { title: '我发布的 - 检测验证', roles: ['apm-vip'] }
      },
       {
        path: 'Verification/create', 
        component: VerificationEditPage, 
        meta: { title: '创建检测验证需求', breadcrumb: [ '创建检测验证需求'], roles: ['apm-vip'] }
      },
      {
        path: 'Verification/detail/:id', 
        component: VerificationDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: [ '检测验证需求详情'], roles: ['apm-vip'] }
      },
      {
        path: 'OfflineEvent',
        component: OfflineEvent,
        meta: { title: '我发布的 - 线下活动', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OfflineEvent/create',
        component: OfflineEventEditPage,
        meta: { title: '创建线下活动', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OfflineEvent/detail/:id',
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        component: OfflineEventDetailPage,
        meta: { title: '线下活动详情', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
    ]
  },
  {
    path: '/user/join', // “我参与的” 的父路由
    component: UserCenterCommonLayout, // 使用新的通用顶部布局
    meta: { requiresAuth: true, },
    redirect: '/user/join/DomesticSourcing', // 默认跳转到第一个子页签
    children: [
     {
        path: 'DomesticSourcing', // 相对路径
        component: joinDomesticSourcing, // 这个页面现在是子路由
        meta: { title: '我参与的 - 多元化寻源', roles: ['apm-vip']  }
      },
      {
        path: 'DomesticSourcing/detail/:id', 
        component: joinDomesticSourcingDetailPage, 
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '多元化寻源详情', breadcrumb: ['多元化寻源'], roles: ['apm-vip'] }
      },
      {
        path: 'OEMPartsSourcing',
        component: joinOEMPartsSourcing, 
        meta: { title: '我参与的 - 原厂件寻源', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      },
      {
        path: 'OEMPartsSourcing/detail/:id', 
        component: joinOEMPartsDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '原厂件寻源详情', breadcrumb: ['原厂件寻源详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      },
      {
        path: 'PublicRelations',
        component: joinPublicRelations,
        meta: { title: '我参与的 - 研发攻关', roles: ['apm-vip'] }
      },
      {
        path: 'PublicRelations/detail/:id', 
        component: joinPublicRelationsDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '研发攻关需求详情', breadcrumb: [ '研发攻关需求详情'], roles: ['apm-vip'] }
      },
      {
        path: 'Verification',
        component: joinVerification,
        meta: { title: '我参与的 - 检测验证', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'Verification/detail/:id', 
        component: joinVerificationDetailPage, 
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: [ '检测验证需求详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OfflineEvent',
        component: joinOfflineEvent,
        meta: { title: '我参与的 - 线下活动', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
      },
      {
        path: 'OfflineEvent/detail/:id',
        props: route => ({ IdProp: route.params.id}), // 通过 props 传递 mode 和 id
        component: JoinOfflineEventDetailPage,
        meta: { title: '线下活动详情', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
      },
    ]
  },
  {
    path: '/user/setting',
    component: UserCenterCommonLayout,
    meta: { requiresAuth: true, roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] },
    children: [
      {
        path: 'userCenterInfo',
        component: MemberInfoPage,
        meta: { title: '会员信息' }
      },
      {
        path: 'userCenterPassword',
        component: passWordPage,
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/todo',
    component: UserCenterCommonLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'list',
        component: todoList,
        meta: { title: '我的待办', roles: ['apm-vip'] }
      },
    
    ]
  }
  // ... 其他顶层用户中心路由 ...
];

export default userCenterRoutes;