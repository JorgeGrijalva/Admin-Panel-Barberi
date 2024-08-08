// ** React Imports
import { lazy } from 'react';

const SellerBonusRoutes = [
  {
    path: 'seller/bonus',
    component: lazy(() => import('views/seller-views/bonus')),
  },
  {
    path: 'seller/bonus/product',
    component: lazy(() => import('views/seller-views/product-bonus')),
  },
  {
    path: 'seller/product-bonus/add',
    component: lazy(() =>
      import('views/seller-views/product-bonus/product-bonus-add')
    ),
  },
  {
    path: 'seller/product-bonus/:id',
    component: lazy(() =>
      import('views/seller-views/product-bonus/product-bonus-edit')
    ),
  },

  // bonus shop
  {
    path: 'seller/bonus/shop',
    component: lazy(() => import('views/seller-views/shop-bonus')),
  },
  {
    path: 'seller/shop-bonus/add',
    component: lazy(() =>
      import('views/seller-views/shop-bonus/shop-bonus-add')
    ),
  },
  {
    path: 'seller/shop-bonus/:id',
    component: lazy(() =>
      import('views/seller-views/shop-bonus/shop-bonus-edit')
    ),
  },
];

export default SellerBonusRoutes;
