import { lazy } from 'react';

const SellerFormOptionsRoutes = [
  {
    path: '/seller/form-options',
    component: lazy(() => import('views/seller-views/form-options')),
  },
  {
    path: '/seller/form-options/add',
    component: lazy(
      () => import('views/seller-views/form-options/form-options-add'),
    ),
  },
  {
    path: '/seller/form-options/:id',
    component: lazy(
      () => import('views/seller-views/form-options/form-options-edit'),
    ),
  },
];

export default SellerFormOptionsRoutes;
