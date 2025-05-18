// src/features/demand_square/routes.js
const demandSquareRoutes = [
  {
    path: '/demand-square', // Or a more specific path like /sourcing/alternatives
    name: 'DemandSquare',
    component: () => import('@/features/demand_square/views/DemandSquarePage.vue'),
    meta: {
      title: '需求广场 - 爱芯享信息共享平台',
      requiresAuth: false, // Or true if login is needed to view
    }
  }
  // You might add child routes here for specific demand details later
  // e.g., /demand-square/:id
];

export default demandSquareRoutes;