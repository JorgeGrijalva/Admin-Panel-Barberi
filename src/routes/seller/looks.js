import { lazy } from 'react';

const SellerLooksRoutes = [
  {
    path: 'seller/looks',
    component: lazy(() => import('views/seller-views/looks')),
  },
  {
    path: 'seller/looks/add',
    component: lazy(() => import('views/seller-views/looks/add')),
  },
  {
    path: 'seller/looks/:id',
    component: lazy(() => import('views/seller-views/looks/edit')),
  },
];

export default SellerLooksRoutes;
