import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const DomesticSourcing = () => import('../views/demands/DomesticSourcing.vue');
const OEMPartsSourcing = () => import('../views/demands/OEMPartsSourcing.vue');
const DemandDetailPage = () => import('../views/demands/DemandDetailPage.vue');
const PublicRelations = () => import('../views/demands/PublicRelations.vue');
const Verification = () => import('../views/demands/Verification.vue');
const PublicRelationsDetailPage = () => import('../views/demands/PublicRelationsDetailPage.vue');
const VerificationDetailPage = () => import('../views/demands/VerificationDetailPage.vue');
// ... other demand related imports

export const demandsRoutes = {
  path: 'demands', // Parent path for this group
  component: UserCenterLayout,
  meta: { breadcrumbBase: ['会员中心', '需求广场'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'DomesticSourcing',
      name: 'DomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '国产替代寻源 - 用户中心', breadcrumb: ['国产替代寻源'] } // Appends to base
    },
    {
      path: 'OEMPartsSourcing',
      name: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源 - 用户中心', breadcrumb: ['原厂件寻源'] } // Appends to base
    },
    {
      path: 'DemandDetailPage/create', // 新建需求的路由
      name: 'CreateDemand',
      component: DemandDetailPage, // 复用 DemandDetailPage
      props: route => ({ mode: 'create', demandType: route.query.type, business_type: route.query.business_type }), // 通过 props 传递 mode
      meta: { title: '新建需求 - 用户中心', breadcrumb: ['会员中心', '需求广场', '新建需求'] }
    },
    {
      path: 'DemandDetailPage/:demandId', // 查看/编辑需求的路由
      name: 'DemandDetail',
      component: DemandDetailPage, // 复用 DemandDetailPage
      props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type }), // 通过 props 传递 mode 和 id
      meta: { title: '需求详情 - 用户中心', breadcrumb: ['会员中心', '需求广场', '需求详情'] }
    },
    {
      path: 'PublicRelations',
      name: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发公关 - 用户中心', breadcrumb: ['研发公关'] } // Appends to base
    },
    
    {
      path: 'PublicRelationsDetailPage/create', // 新建需求的路由
      name: 'CreatePublic',
      component: PublicRelationsDetailPage, // 复用 DemandDetailPage
      props: route => ({ mode: 'create', demandType: route.query.type || 'rndCollaboration', business_type: route.query.business_type }), // 通过 props 传递 mode
      meta: { title: '新建研发公关 - 用户中心', breadcrumb: ['会员中心', '需求广场', '新建研发公关'] }
    },
    {
      path: 'PublicRelationsDetailPage/:demandId', // 查看/编辑需求的路由
      name: 'PublicDetail',
      component: PublicRelationsDetailPage, // 复用 DemandDetailPage
      props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'rndCollaboration' }), // 通过 props 传递 mode 和 id
      meta: { title: '研发公关详情 - 用户中心', breadcrumb: ['会员中心', '需求广场', '研发公关详情'] }
    },
    {
      path: 'Verification',
      name: 'Verification',
      component: Verification,
      meta: { title: '检验验证 - 用户中心', breadcrumb: ['检验验证'] } // Appends to base
    },
     {
      path: 'Verification/create', // 新建需求的路由
      name: 'CreateVerification',
      component: VerificationDetailPage, // 复用 DemandDetailPage
      props: route => ({ mode: 'create', demandType: route.query.type || 'Verification', business_type: route.query.business_type }), // 通过 props 传递 mode
      meta: { title: '新建检验验证 - 用户中心', breadcrumb: ['会员中心', '需求广场', '新建检验验证'] }
    },
     {
      path: 'Verification/:demandId', // 查看/编辑需求的路由
      name: 'VerificationDetail',
      component: VerificationDetailPage, // 复用 DemandDetailPage
      props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'Verification' }), // 通过 props 传递 mode 和 id
      meta: { title: '检验验证详情 - 用户中心', breadcrumb: ['会员中心', '需求广场', '检验验证详情'] }
    },
    
    // {
    //   path: 'original-sourcing',
    //   name: 'UserMyOriginalSourcing',
    //   component: () => import('../views/demands/MyOriginalSourcingPage.vue'),
    //   meta: { title: '原厂件寻源 - 用户中心', breadcrumb: ['原厂件寻源'] }
    // },
    // ... other demand types
  ]
};