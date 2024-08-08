import { lazy } from 'react';

const ShopAds = [
  {
    path: 'catalog/shop-ads',
    component: lazy(() => import('views/shop-ads')),
  },
  {
    path: 'shop-ads/:id',
    component: lazy(() => import('views/shop-ads/shop-ads-edit')),
  },
];

export default ShopAds;
