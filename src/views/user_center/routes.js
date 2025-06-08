// src/features/user_center/routes.js
import UserCenterCommonLayout from './layouts/UserCenterCommonLayout.vue'; // 新的通用布局

// const MyAlternativeSourcingPage = () => import('./views/MyAlternativeSourcingPage.vue'); 
// const MyOriginalSourcingPage = () => import('./views/MyOriginalSourcingPage.vue'); // 需要创建
// ... 其他视图 ...
// const DemandDetailPage = () => import('./views/DemandDetailPage.vue');
// const MemberInfoPage = () => import('./views/MemberInfoPage.vue');
const DomesticSourcing = () => import('./views/publications/DomesticSourcing.vue'); 
const OEMPartsSourcing = () => import('./views/publications/OEMPartsSourcing.vue'); 
const PublicRelations = () => import('./views/publications/PublicRelations.vue'); 
const Verification = () => import('./views/publications/Verification.vue'); 
const OfflineEvent = () => import('./views/publications/OfflineEvent.vue'); 



const DomesticDetailPage = () => import('./views/publications/DomesticDetailPage.vue');
const OEMPartsDetailPage = () => import('./views/publications/OEMPartsDetailPage.vue');
const PublicRelationsDetailPage = () => import('./views/publications/PublicRelationsDetailPage.vue');
const VerificationDetailPage = () => import('./views/publications/VerificationDetailPage.vue');
const userCenterRoutes = [
  {
    path: '/user/published', // “我发布的” 的父路由
    component: UserCenterCommonLayout, // 使用新的通用顶部布局
    meta: { requiresAuth: true },
    redirect: '/user/published/DomesticSourcing', // 默认跳转到第一个子页签
    children: [
      {
        path: 'DomesticSourcing', // 相对路径
        name: 'PublishedAlternativeSourcing',
        component: DomesticSourcing, // 这个页面现在是子路由
        meta: { title: '我发布的 - 国产替代寻源' }
      },
      {
        path: 'DomesticSourcing/:demandId', // 查看/编辑需求的路由
        name: 'DomesticDetailPage',
        component: DomesticDetailPage, // 复用 DemandDetailPage
        props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type }), // 通过 props 传递 mode 和 id
        meta: { title: '国产替代寻源详情', breadcrumb: ['国产替代寻源详情'] }
      },
      {
        path: 'DomesticSourcing/create', // 新建需求的路由
        name: 'DomesticCreatePage',
        component: DomesticDetailPage, // 复用 DemandDetailPage
        props: route => ({ mode: 'create', demandType: route.query.type }), // 通过 props 传递 mode
        meta: { title: '创建国产替代寻源需求', breadcrumb: ['创建国产替代寻源需求'] }
      },
      {
        path: 'OEMPartsSourcing',
        name: 'PublishedOriginalSourcing',
        component: OEMPartsSourcing, // 需要创建这个页面
        meta: { title: '我发布的 - 原厂件寻源' }
      },
      {
        path: 'OEMPartsSourcing/create', // 新建需求的路由
        name: 'OEMPartsCreatePage',
        component: OEMPartsDetailPage, // 复用 DemandDetailPage
        props: route => ({ mode: 'create', demandType: route.query.type }), // 通过 props 传递 mode
        meta: { title: '创建原厂件寻源需求', breadcrumb: ['创建原厂件寻源需求'] }
      },
      {
        path: 'OEMPartsSourcing/:demandId', // 查看/编辑需求的路由
        name: 'OEMPartsDetailPage',
        component: OEMPartsDetailPage, // 复用 DemandDetailPage
        props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type }), // 通过 props 传递 mode 和 id
        meta: { title: '原厂件寻源详情', breadcrumb: ['原厂件寻源详情'] }
      },
      {
        path: 'PublicRelations',
        name: 'PublishedRndCollaboration',
        component: PublicRelations, // 示例
        meta: { title: '我发布的 - 研发攻关' }
      },
      {
        path: 'PublicRelations/create', // 新建需求的路由
        name: 'CreatePublic',
        component: PublicRelationsDetailPage, // 复用 DemandDetailPage
        props: route => ({ mode: 'create', demandType: route.query.type || 'rndCollaboration', business_type: route.query.business_type }), // 通过 props 传递 mode
        meta: { title: '创建研发攻关', breadcrumb: ['创建研发攻关需求'] }
      },
      {
        path: 'PublicRelations/:demandId', // 查看/编辑需求的路由
        name: 'PublicDetail',
        component: PublicRelationsDetailPage, // 复用 DemandDetailPage
        props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'rndCollaboration' }), // 通过 props 传递 mode 和 id
        meta: { title: '研发攻关需求详情', breadcrumb: [ '研发攻关需求详情'] }
      },
      {
        path: 'Verification',
        name: 'PublishedTestingValidation',
        component: Verification, // 示例
        meta: { title: '我发布的 - 检测验证' }
      },
       {
        path: 'Verification/create', // 新建需求的路由
        name: 'CreateVerification',
        component: VerificationDetailPage, // 复用 DemandDetailPage
        props: route => ({ mode: 'create', demandType: route.query.type || 'Verification', business_type: route.query.business_type }), // 通过 props 传递 mode
        meta: { title: '创建检测验证需求', breadcrumb: [ '创建检测验证需求'] }
      },
      {
        path: 'Verification/:demandId', // 查看/编辑需求的路由
        name: 'VerificationDetail',
        component: VerificationDetailPage, // 复用 DemandDetailPage
        props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'Verification' }), // 通过 props 传递 mode 和 id
        meta: { title: '检测验证需求详情', breadcrumb: [ '检测验证需求详情'] }
      },
      {
        path: 'OfflineEvent',
        name: 'PublishedOfflineEvents',
        component: OfflineEvent, // 示例
        meta: { title: '我发布的 - 线下活动' }
      },
      // // 详情页和新建页可以放在这个层级，也可以放在更顶层
      // {
      //   path: ':demandType/new', // e.g., /user/published/alternative-sourcing/new
      //   name: 'UserCreateDemand',
      //   component: DemandDetailPage,
      //   props: route => ({
      //     mode: 'create',
      //     demandType: route.params.demandType,
      //     // business_type: route.params.demandType // 或者从其他地方获取业务类型
      //   }),
      //   meta: { title: '新建需求' }
      // },
      // {
      //   path: ':demandType/detail/:demandId', // e.g., /user/published/alternative-sourcing/detail/123
      //   name: 'UserDemandDetail',
      //   component: DemandDetailPage,
      //   props: route => ({
      //     demandIdProp: route.params.demandId,
      //     mode: 'view',
      //     demandType: route.params.demandType,
      //   }),
      //   meta: { title: '需求详情' }
      // }
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