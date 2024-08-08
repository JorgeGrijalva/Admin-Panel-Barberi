import { lazy } from 'react';

const SellerServicesRoutes = [
  {
    path: 'seller/services',
    component: lazy(() => import('views/seller-views/services')),
  },
  {
    path: 'seller/services/add',
    component: lazy(() => import('views/seller-views/services/create')),
  },
  {
    path: 'seller/services/:id',
    component: lazy(() => import('views/seller-views/services/edit')),
  },
];

export default SellerServicesRoutes;
