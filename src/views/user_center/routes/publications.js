import UserCenterLayout from '../layouts/UserCenterLayout.vue';
// const MyPublishedContentPage = () => import('../views/publications/MyPublishedContentPage.vue');

export const publicationsRoutes = {
  path: 'publications', // Base: /user/publications
  component: UserCenterLayout,
  redirect: '/user/publications/all',
  children: [
    // {
    //   path: 'all',
    //   name: 'UserMyPublications',
    //   component: MyPublishedContentPage,
    //   meta: { title: '我的发布', breadcrumb: ['会员中心', '我发布的', '已发布内容'] }
    // }
    // Potentially sub-routes for reports, events if needed
  ]
};