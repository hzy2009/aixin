import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const MyAlternativeSourcingPage = () => import('../views/demands/MyAlternativeSourcingPage.vue');
// const MyOriginalSourcingPage = () => import('../views/demands/MyOriginalSourcingPage.vue');
// ... import other demand type pages

export const demandsRoutes = {
  path: 'demands', // Base: /user/demands
  component: UserCenterLayout,
  redirect: '/user/demands/alternative-sourcing',
  children: [
    {
      path: 'alternative-sourcing', // /user/demands/alternative-sourcing
      name: 'UserMyAlternativeSourcing',
      component: MyAlternativeSourcingPage,
      meta: { title: '国产替代寻源', breadcrumb: ['会员中心', '需求广场', '国产替代寻源'] }
    },
    // {
    //   path: 'original-sourcing', // /user/demands/original-sourcing
    //   name: 'UserMyOriginalSourcing',
    //   component: MyOriginalSourcingPage,
    //   meta: { title: '原厂件寻源', breadcrumb: ['会员中心', '需求广场', '原厂件寻源'] }
    // },
    // Add R&D, Testing etc. here
  ]
};