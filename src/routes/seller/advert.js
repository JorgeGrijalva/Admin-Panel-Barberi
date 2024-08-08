import { lazy } from 'react';

const SellerAdvertRoutes = [
  {
    path: 'seller/advert',
    component: lazy(() => import('views/seller-views/advert')),
  },
  {
    path: 'seller/shop-ads',
    component: lazy(() => import('views/seller-views/advert/shop-ads')),
  },
];

export default SellerAdvertRoutes;
