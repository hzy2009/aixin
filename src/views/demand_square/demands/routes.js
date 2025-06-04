const DomesticSourcing = () => import('./DomesticSourcing.vue');
const OEMPartsSourcing = () => import('./OEMPartsSourcing.vue');
const DomesticDetailPage = () => import('./DomesticDetailPage.vue');
const OEMPartsDetailPage = () => import('./OEMPartsDetailPage.vue');
const PublicRelations = () => import('./PublicRelations.vue');
const Verification = () => import('./Verification.vue');
const PublicRelationsDetailPage = () => import('./PublicRelationsDetailPage.vue');
const VerificationDetailPage = () => import('./VerificationDetailPage.vue');
// ... other demand related imports

export default {
  path: 'demands', // Parent path for this group
  meta: { breadcrumbBase: ['需求广场'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'DomesticSourcing',
      name: 'DomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '国产替代寻源', breadcrumb: ['国产替代寻源'] } // Appends to base
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
      name: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'] } // Appends to base
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
      name: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发攻关', breadcrumb: ['研发攻关'] } // Appends to base
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
      name: 'Verification',
      component: Verification,
      meta: { title: '检测验证', breadcrumb: ['检测验证需求'] } // Appends to base
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
  ]
};