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
      path: 'alternative-sourcing/create', // 新建需求的路由
      name: 'CreateDemand',
      component: DemandDetailPage, // 复用 DemandDetailPage
      props: route => ({ mode: 'create', demandType: route.query.type || 'alternativeSourcing' }), // 通过 props 传递 mode
      meta: { title: '新建需求 - 用户中心', breadcrumb: ['会员中心', '需求广场', '新建需求'] }
    },
    {
      path: 'alternative-sourcing/:demandId', // 查看/编辑需求的路由
      name: 'DemandDetail',
      component: DemandDetailPage, // 复用 DemandDetailPage
      props: route => ({ demandIdProp: route.params.demandId, mode: 'view', demandType: route.query.type || 'alternativeSourcing' }), // 通过 props 传递 mode 和 id
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