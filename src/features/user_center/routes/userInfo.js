import UserCenterLayout from '../layouts/UserCenterLayout.vue';
const MemberInfoPage = () => import('../views/userInfo/MemberInfoPage.vue');
// const AccountSettingsPage = () => import('../views/userInfo/AccountSettingsPage.vue');

export const userInfoRoutes = {
  path: 'info', // Base: /user/info
  component: UserCenterLayout, // Or a specific sub-layout if needed
  redirect: '/user/info/member',
  children: [
    {
      path: 'member', // /user/info/member
      name: 'UserMemberInfo',
      component: MemberInfoPage,
      meta: { title: '会员信息', breadcrumb: ['会员中心', '账户管理', '会员信息'] }
    },
    // {
    //   path: 'settings', // /user/info/settings
    //   name: 'UserAccountSettings',
    //   component: AccountSettingsPage,
    //   meta: { title: '账户设置', breadcrumb: ['会员中心', '账户管理', '用户管理'] }
    // },
  ]
};