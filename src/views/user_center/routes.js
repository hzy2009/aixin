// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

const DomesticSourcing = () => import('./views/publications/DomesticSourcing/list.vue');
const DomesticEditPage = () => import('./views/publications/DomesticSourcing/edit.vue');
const DomesticDetailPage = () => import('./views/publications/DomesticSourcing/detail.vue');


const OEMPartsSourcing = () => import('./views/publications/OEMParts/list.vue');
const OEMPartsEditPage = () => import('./views/publications/OEMParts/edit.vue');
const OEMPartsDetailPage = () => import('./views/publications/OEMParts/detail.vue');


const PublicRelations = () => import('./views/publications/PublicRelations/list.vue');
const PublicRelationsDetailPage = () => import('./views/publications/PublicRelations/detail.vue');
const PublicRelationsEditPage = () => import('./views/publications/PublicRelations/edit.vue');



const Verification = () => import('./views/publications/Verification/list.vue');
const VerificationDetailPage = () => import('./views/publications/Verification/detail.vue');
const VerificationEditPage = () => import('./views/publications/Verification/edit.vue');



const OfflineEvent = () => import('./views/publications/OfflineEvent/list.vue');
const OfflineEventDetailPage = () => import('./views/publications/OfflineEvent/detail.vue');
const OfflineEventEditPage = () => import('./views/publications/OfflineEvent/edit.vue');



const oemPartsPage = () => import('./views/publications/secondTrade/oemParts/list.vue');
const oemPartsPageDetail = () => import('./views/publications/secondTrade/oemParts/detail.vue');
const oemPartsPageEdit = () => import('./views/publications/secondTrade/oemParts/edit.vue');

const usedEqpTrade = () => import('./views/publications/secondTrade/usedEqpTrade/list.vue');
const usedEqpTradeDetail = () => import('./views/publications/secondTrade/usedEqpTrade/detail.vue');
const usedEqpTradeEdit = () => import('./views/publications/secondTrade/usedEqpTrade/edit.vue');

const joinDomesticSourcing = () => import('./views/join/DomesticSourcing/list.vue');
const joinDomesticSourcingDetailPage = () => import('./views/join/DomesticSourcing/detail.vue');


const joinOEMPartsSourcing = () => import('./views/join/OEMParts/list.vue');
const joinOEMPartsDetailPage = () => import('./views/join/OEMParts/detail.vue');


const joinPublicRelations = () => import('./views/join/PublicRelations/list.vue');
const joinPublicRelationsDetailPage = () => import('./views/join/PublicRelations/detail.vue');



const joinVerification = () => import('./views/join/Verification/list.vue');
const joinVerificationDetailPage = () => import('./views/join/Verification/detail.vue');



const joinOfflineEvent = () => import('./views/join/OfflineEvent/list.vue');
const JoinOfflineEventDetailPage = () => import('./views/join/OfflineEvent/detail.vue');


const joinOemPartsPage = () => import('./views/join/secondTrade/oemParts/list.vue');
const joinOemPartsPageDetail = () => import('./views/join/secondTrade/oemParts/detail.vue');

const joinUsedEqpTrade = () => import('./views/join/secondTrade/usedEqpTrade/list.vue');
const joinUsedEqpTradeDetail = () => import('./views/join/secondTrade/usedEqpTrade/detail.vue');


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
        meta: { title: '我发布的 - 本土采购' }
      },
      {
        path: 'DomesticSourcing/detail/:id',
        component: DomesticDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '本土采购', breadcrumb: ['本土采购'] }
      },
      {
        path: 'DomesticSourcing/create',
        component: DomesticEditPage,
        meta: { title: '创建本土采购需求', breadcrumb: ['创建本土采购需求'] }
      },


      {
        path: 'OEMPartsSourcing',
        component: OEMPartsSourcing,
        meta: { title: '我发布的 - 跨境采购', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OEMPartsSourcing/create',
        component: OEMPartsEditPage,
        meta: { title: '创建跨境采购需求', breadcrumb: ['创建跨境采购需求'], roles: ['apm-vip-inspection, apm-vip'] }
      },
      {
        path: 'OEMPartsSourcing/detail/:id',
        component: OEMPartsDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '跨境采购详情', breadcrumb: ['跨境采购详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },

      {
        path: 'PublicRelations',
        component: PublicRelations,
        meta: { title: '我发布的 - 定制开发' }
      },
      {
        path: 'PublicRelations/create',
        component: PublicRelationsEditPage,
        meta: { title: '创建定制开发', breadcrumb: ['创建定制开发需求'] }
      },
      {
        path: 'PublicRelations/detail/:id',
        component: PublicRelationsDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '定制开发需求详情', breadcrumb: ['定制开发需求详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'Verification',
        component: Verification,
        meta: { title: '我发布的 - 检测验证', roles: ['apm-vip'] }
      },
      {
        path: 'Verification/create',
        component: VerificationEditPage,
        meta: { title: '创建检测验证需求', breadcrumb: ['创建检测验证需求'], roles: ['apm-vip'] }
      },
      {
        path: 'Verification/detail/:id',
        component: VerificationDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: ['检测验证需求详情'], roles: ['apm-vip'] }
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
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: OfflineEventDetailPage,
        meta: { title: '线下活动详情', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'oemParts',
        component: oemPartsPage,
        meta: { title: '原厂件库存处理', roles: ['apm-register'] }
      },
      {
        path: 'oemParts/detail/:id',
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: oemPartsPageDetail,
        meta: { title: '原厂件库存处理详情', roles: ['apm-register'] }
      },
      {
        path: 'oemParts/create',
        component: oemPartsPageEdit,
        meta: { title: '原厂件库存处理', roles: ['apm-register'] }
      },
      {
        path: 'usedEqpTrade',
        component: usedEqpTrade,
        meta: { title: '二手设备交易', roles: ['apm-register'] }
      },
      {
        path: 'usedEqpTrade/detail/:id',
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: usedEqpTradeDetail,
        meta: { title: '二手设备交易详情', roles: ['apm-register'] }
      },
      {
        path: 'usedEqpTrade/create',
        component: usedEqpTradeEdit,
        meta: { title: '二手设备交易', roles: ['apm-register'] }
      }
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
        meta: { title: '我参与的 - 本土采购', roles: ['apm-vip'] }
      },
      {
        path: 'DomesticSourcing/detail/:id',
        component: joinDomesticSourcingDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '本土采购详情', breadcrumb: ['本土采购'], roles: ['apm-vip'] }
      },
      {
        path: 'OEMPartsSourcing',
        component: joinOEMPartsSourcing,
        meta: { title: '我参与的 - 跨境采购', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      },
      {
        path: 'OEMPartsSourcing/detail/:id',
        component: joinOEMPartsDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '跨境采购详情', breadcrumb: ['跨境采购详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      },
      {
        path: 'PublicRelations',
        component: joinPublicRelations,
        meta: { title: '我参与的 - 定制开发', roles: ['apm-vip'] }
      },
      {
        path: 'PublicRelations/detail/:id',
        component: joinPublicRelationsDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '定制开发需求详情', breadcrumb: ['定制开发需求详情'], roles: ['apm-vip'] }
      },
      {
        path: 'Verification',
        component: joinVerification,
        meta: { title: '我参与的 - 检测验证', roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'Verification/detail/:id',
        component: joinVerificationDetailPage,
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: ['检测验证需求详情'], roles: ['apm-vip', 'apm-vip-inspection'] }
      },
      {
        path: 'OfflineEvent',
        component: joinOfflineEvent,
        meta: { title: '我参与的 - 线下活动', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
      },
      {
        path: 'OfflineEvent/detail/:id',
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: JoinOfflineEventDetailPage,
        meta: { title: '线下活动详情', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
      },
      {
        path: 'oemParts',
        component: joinOemPartsPage,
        meta: { title: '原厂件库存处理', roles: ['apm-vip', 'apm-register', 'apm-vip-inspection'] }
      },
      {
        path: 'oemParts/detail/:id',
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: joinOemPartsPageDetail,
        meta: { title: '原厂件库存处理详情', roles: ['apm-vip', 'apm-register', 'apm-vip-inspection'] }
      },
      {
        path: 'usedEqpTrade',
        component: joinUsedEqpTrade,
        meta: { title: '二手设备交易', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      },
      {
        path: 'usedEqpTrade/detail/:id',
        props: route => ({ IdProp: route.params.id }), // 通过 props 传递 mode 和 id
        component: joinUsedEqpTradeDetail,
        meta: { title: '二手设备交易详情', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] }
      }
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
        meta: { title: '我的待办', roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] }
      },

    ]
  }
  // ... 其他顶层用户中心路由 ...
];

export default userCenterRoutes;