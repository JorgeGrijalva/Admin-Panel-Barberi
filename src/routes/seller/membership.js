import { lazy } from 'react';

const SellerMembershipRoutes = [
  // admin
  {
    path: 'seller/membership',
    component: lazy(() => import('views/seller-views/membership')),
  },
  {
    path: 'seller/membership/add',
    component: lazy(() => import('views/seller-views/membership/add')),
  },
  {
    path: 'seller/membership/edit/:id',
    component: lazy(() => import('views/seller-views/membership/edit')),
  },
];

export default SellerMembershipRoutes;
