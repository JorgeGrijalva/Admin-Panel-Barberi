// ** React Imports
import { lazy } from 'react';

const ShopRoutes = [
  {
    path: 'shops',
    component: lazy(() => import('views/shops')),
  },
  {
    path: 'shop/add',
    component: lazy(() => import('views/shops/shops-add')),
  },
  {
    path: 'shop/:uuid',
    component: lazy(() => import('views/shops/shop-edit')),
  },
  {
    path: 'shop-clone/:uuid',
    component: lazy(() => import('views/shops/shop-clone')),
  },
  {
    path: 'shop-reviews',
    component: lazy(() => import('views/shop-reviews')),
  },
];

export default ShopRoutes;
