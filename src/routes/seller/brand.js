// ** React Imports
import { lazy } from 'react';

const SellerBrandRoutes = [
  {
    path: 'seller/brands',
    component: lazy(() => import('views/seller-views/brands')),
  },
  {
    path: 'seller/brand/add',
    component: lazy(() => import('views/seller-views/brands/brand-add')),
  },
  {
    path: 'seller/brand/:id',
    component: lazy(() => import('views/seller-views/brands/brand-edit')),
  },
];

export default SellerBrandRoutes;
