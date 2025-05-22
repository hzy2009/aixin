import UserCenterLayout from '../layouts/UserCenterLayout.vue';
// const MessageCenterPage = () => import('../views/messages/MessageCenterPage.vue');

export const messagesRoutes = {
  path: 'messages', // Base: /user/messages
  component: UserCenterLayout, // Assuming it uses the same overall layout
  // redirect: '/user/messages/inbox', // If there are sub-sections
  children: [
    // {
    //   path: '', // /user/messages
    //   name: 'UserMessageCenter',
    //   component: MessageCenterPage,
    //   meta: { title: '消息中心', breadcrumb: ['会员中心', '消息中心'] }
    // }
  ]
};