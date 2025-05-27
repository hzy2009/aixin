import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const DomesticSourcing = () => import('../views/publications/DomesticSourcing.vue');
const OEMPartsSourcing = () => import('../views/publications/OEMPartsSourcing.vue');
const PublicRelations = () => import('../views/publications/PublicRelations.vue');
const Verification = () => import('../views/publications/Verification.vue');
// ... other demand related imports

export const publicationsRoutes = {
  path: 'publications', // Parent path for this group
  component: UserCenterLayout,
  meta: { breadcrumbBase: ['我发布的'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'DomesticSourcing',
      component: DomesticSourcing,
      meta: { title: '国产替代寻源', breadcrumb: ['国产替代寻源'] } // Appends to base
    },
    {
      path: 'OEMPartsSourcing',
      component: OEMPartsSourcing,
      meta: { title: '原厂件寻源', breadcrumb: ['原厂件寻源'] } // Appends to base
    },
    {
      path: 'PublicRelations',
      component: PublicRelations,
      meta: { title: '研发公关', breadcrumb: ['研发公关'] } // Appends to base
    },
    {
      path: 'Verification',
      component: Verification,
      meta: { title: '检验验证', breadcrumb: ['检验验证'] } // Appends to base
    },
  ]
};