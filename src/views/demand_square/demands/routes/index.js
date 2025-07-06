const DomesticSourcing = () => import('../DomesticSourcing.vue');
const DomesticDetailPage = () => import('../DomesticDetailPage.vue');

const OEMPartsSourcing = () => import('../OEMPartsSourcing.vue');
const OEMPartsDetailPage = () => import('../OEMPartsDetailPage.vue');

const PublicRelations = () => import('../PublicRelations.vue');
const PublicRelationsDetailPage = () => import('../PublicRelationsDetailPage.vue');

const Verification = () => import('../Verification.vue');
const VerificationDetailPage = () => import('../VerificationDetailPage.vue');

const OfflineEvent = () => import('../OfflineEvent.vue');
const OfflineEventDetailPage = () => import('../OfflineEventDetailPage.vue');

const IndustryReport = () => import('../IndustryReport.vue');
const IndustryReportDetailPage = () => import('../IndustryReportDetailPage.vue');


const Talent = () => import('../Talent.vue');
const TalentDetailPage = () => import('../TalentDetailPage.vue');
// ... other demand related imports

export default [{
  path: 'demands', // Parent path for this group
  meta: { breadcrumbBase: ['需求广场'], requiresAuth: true }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'DomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '多元化寻源', breadcrumb: ['多元化寻源'], requiresAuth: false } // Appends to base
    },
    {
      path: 'DomesticDetailPage/:id',
      component: DomesticDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '多元化寻源详情', breadcrumb: ['多元化寻源详情']} // Appends to base
    },
    {
      path: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'], requiresAuth: false } // Appends to base
    },
    {
      path: 'OEMPartsDetailPage/:id',
      component: OEMPartsDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '原厂件寻源详情', breadcrumb: ['原厂件寻源详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register']  } // Appends to base
    },
    {
      path: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发攻关', breadcrumb: ['研发攻关'], requiresAuth: false } // Appends to base
    },
    {
      path: 'PublicRelationsDetailPage/:id',
      component: PublicRelationsDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '研发攻关详情', breadcrumb: ['研发攻关详情'], roles: ['apm-vip', 'apm-register', 'apm-register-expert'] } // Appends to base
    },
    {
      path: 'Verification',
      component: Verification,
      meta: { title: '检测验证', breadcrumb: ['检测验证需求'], requiresAuth: false } // Appends to base
    },
    {
      path: 'VerificationDetailPage/:id',
      component: VerificationDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '检测验证详情', breadcrumb: ['检测验证详情'], roles: ['apm-vip', 'apm-vip-inspection']  } // Appends to base
    },
    {
      path: 'IndustryReport',
      component: IndustryReport,
      meta: { title: '行研报告', breadcrumb: ['行研报告'], requiresAuth: false } // Appends to base
    },
    {
      path: 'IndustryReportDetailPage/:id',
      component: IndustryReportDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '行研报告详情', breadcrumb: ['行研报告详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-register-expert'] } // Appends to base
    },
    {
      path: 'OfflineEvent',
      component: OfflineEvent,
      meta: { title: '线下活动', breadcrumb: ['线下活动'], requiresAuth: false } // Appends to base
    },
    {
      path: 'OfflineEventDetailPage/:id',
      component: OfflineEventDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '线下活动详情', breadcrumb: ['线下活动详情'], roles: ['apm-vip', 'apm-vip-inspection', 'apm-register'] } // Appends to base
    },
    {
      path: 'Talent',
      component: Talent,
      meta: { title: '专家人才', breadcrumb: ['专家人才'], requiresAuth: false } // Appends to base
    },
     {
      path: 'TalentDetailPage/:id',
      component: TalentDetailPage,
      props: route => ({ IdProp: route.params.id}),
      meta: { title: '专家人才详情', breadcrumb: ['专家人才详情'] } // Appends to base
    },
  ]
}];