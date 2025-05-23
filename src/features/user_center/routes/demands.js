import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const MyAlternativeSourcingPage = () => import('../views/demands/MyAlternativeSourcingPage.vue');
const DemandDetailPage = () => import('../views/demands/DemandDetailPage.vue');
// ... other demand related imports

export const demandsRoutes = {
  path: 'demands', // Parent path for this group
  component: UserCenterLayout,
  meta: { breadcrumbBase: ['会员中心', '需求广场'] }, // Base for breadcrumbs in this group
  children: [
    {
      path: 'alternative-sourcing',
      name: 'UserMyAlternativeSourcing',
      component: MyAlternativeSourcingPage,
      meta: { title: '国产替代寻源 - 用户中心', breadcrumb: ['国产替代寻源'] } // Appends to base
    },
    {
      path: 'DemandPage/:id',
      name: 'DemandDetailPage',
      component: DemandDetailPage,
      meta: { title: '国产替代寻源 - 用户中心', breadcrumb: ['国产替代寻源'] } // Appends to base
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