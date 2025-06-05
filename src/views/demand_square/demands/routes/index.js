const DomesticSourcing = () => import('../DomesticSourcing.vue');
const OEMPartsSourcing = () => import('../OEMPartsSourcing.vue');

const PublicRelations = () => import('../PublicRelations.vue');
const Verification = () => import('../Verification.vue');

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
      path: 'OEMPartsSourcing',
      name: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'] } // Appends to base
    },
    {
      path: 'PublicRelations',
      name: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发攻关', breadcrumb: ['研发攻关'] } // Appends to base
    },
    {
      path: 'Verification',
      name: 'Verification',
      component: Verification,
      meta: { title: '检测验证', breadcrumb: ['检测验证需求'] } // Appends to base
    },
  ]
};