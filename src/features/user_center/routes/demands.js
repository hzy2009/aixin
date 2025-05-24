import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const DomesticSourcing = () => import('../views/demands/DomesticSourcing.vue');
const OEMPartsSourcing = () => import('../views/demands/OEMPartsSourcing.vue');
const DemandDetailPage = () => import('../views/demands/DemandDetailPage.vue');
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
      props: route => ({ mode: 'create', demandType: route.query.type || 'domestic', business_type: route.query.business_type }), // 通过 props 传递 mode
      meta: { title: '新建需求 - 用户中心', breadcrumb: ['会员中心', '需求广场', '新建需求'] }
    },
    {
      path: 'DemandDetailPage/:demandId', // 查看/编辑需求的路由
      name: 'DemandDetail',
      component: DemandDetailPage, // 复用 DemandDetailPage
      props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'domestic' }), // 通过 props 传递 mode 和 id
      meta: { title: '需求详情 - 用户中心', breadcrumb: ['会员中心', '需求广场', '需求详情'] }
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