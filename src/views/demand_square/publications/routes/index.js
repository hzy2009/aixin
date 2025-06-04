const DomesticSourcing = () => import('../DomesticSourcing.vue');
const OEMPartsSourcing = () => import('../OEMPartsSourcing.vue');
const PublicRelations = () => import('../PublicRelations.vue');
const Verification = () => import('../Verification.vue');
// ... other demand related imports

export default {
  path: 'publications', // Parent path for this group
  meta: { breadcrumbBase: ['我发布的'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'MyDomesticSourcing',
      name: 'MyDomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '国产替代寻源', breadcrumb: ['国产替代寻源'] } // Appends to base
    },
    {
      path: 'MyOEMPartsSourcing',
      name: 'MyOEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'] } // Appends to base
    },
    {
      path: 'MyPublicRelations',
      name: 'MyPublicRelations',
      component: PublicRelations,
      meta: { title: '研发攻关', breadcrumb: ['研发攻关'] } // Appends to base
    },
    {
      path: 'MyVerification',
      name: 'MyVerification',
      component: Verification,
      meta: { title: '检测验证', breadcrumb: ['检测验证'] } // Appends to base
    },
  ]
};