const DomesticSourcing = () => import('../DomesticSourcing.vue');
const DomesticDetailPage = () => import('../DomesticDetailPage.vue');
const OEMPartsSourcing = () => import('../OEMPartsSourcing.vue');

const PublicRelations = () => import('../PublicRelations.vue');
const Verification = () => import('../Verification.vue');
const OfflineEvent = () => import('../OfflineEvent.vue');
const OfflineEventDetailPage = () => import('../OfflineEventDetailPage.vue');
const IndustryReport = () => import('../IndustryReport.vue');
const IndustryReportDetailPage = () => import('../IndustryReportDetailPage.vue');
// ... other demand related imports

export default {
  path: 'demands', // Parent path for this group
  meta: { breadcrumbBase: ['需求广场'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'DomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '国产替代寻源', breadcrumb: ['国产替代寻源'] } // Appends to base
    },
    {
      path: 'DomesticDetailPage/:id',
      component: DomesticDetailPage,
      props: route => ({ demandIdProp: route.params.id}),
      meta: { title: '国产替代寻源详情', breadcrumb: ['国产替代寻源详情'] } // Appends to base
    },
    {
      path: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'] } // Appends to base
    },
    {
      path: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发攻关', breadcrumb: ['研发攻关'] } // Appends to base
    },
    {
      path: 'Verification',
      component: Verification,
      meta: { title: '检测验证', breadcrumb: ['检测验证需求'] } // Appends to base
    },
    {
      path: 'IndustryReport',
      component: IndustryReport,
      meta: { title: '行业报告', breadcrumb: ['行业报告'] } // Appends to base
    },
    {
      path: 'IndustryReportDetailPage/:id',
      component: IndustryReportDetailPage,
      meta: { title: '行业报告详情', breadcrumb: ['行业报告详情'] } // Appends to base
    },
    {
      path: 'OfflineEvent',
      component: OfflineEvent,
      meta: { title: '线下活动', breadcrumb: ['线下活动'] } // Appends to base
    },
    {
      path: 'OfflineEventDetailPage/:id',
      component: OfflineEventDetailPage,
      meta: { title: '线下活动详情', breadcrumb: ['线下活动详情'] } // Appends to base
    },
    // {
    //   path: 'OfflineEvent',
    //   name: 'OfflineEvent',
    //   component: OfflineEvent,
    //   meta: { title: '线下活动', breadcrumb: ['线下活动'] } // Appends to base
    // },
    
  ]
};