// src/features/user_center/routes/index.js
import UserCenterLayout from './layouts/UserCenterLayout.vue';
// import { userInfoRoutes } from './routes/userInfo.js';
import { publicationsRoutes } from './routes/publications.js';
// import { messagesRoutes } from './routes/messages.js';

const userCenterParentRoute = {
  path: '/user',
  meta: { requiresAuth: true },
  // Default redirect for /user if no sub-path is matched
  // This could redirect to the first item in the sidebar or a dashboard
  // redirect: '/user/info/member',
  children: [
    // userInfoRoutes,
    publicationsRoutes,
    // messagesRoutes,
  ]
};

export default [
  userCenterParentRoute
]; // Export as an array