import { lazy } from 'react';

const SellerUserMembershipsRoutes = [
  {
    path: '/seller/user-memberships',
    component: lazy(() => import('views/seller-views/user-memberships')),
  },
];

export default SellerUserMembershipsRoutes;