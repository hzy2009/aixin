const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/views/LoginPage.vue'),
    meta: { title: '会员登录 - 爱芯享集成电路信息共享平台', guestOnly: true } // guestOnly for redirecting if already logged in
  },
  {
    path: '/forgot-password', // For the "忘记密码" link
    name: 'ForgotPassword',
    component: () => import('@/views/auth/views/ForgotPasswordPage.vue'), // Create this later
    meta: { title: '找回密码 - 爱芯享集成电路信息共享平台', guestOnly: true }
  }
  // You'll add /register and /forgot-password here later
];

export default authRoutes;