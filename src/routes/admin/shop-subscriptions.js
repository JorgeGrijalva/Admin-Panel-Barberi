import { lazy } from 'react';

const ShopSubscriptionsRoutes = [
  {
    path: 'shop-subscriptions',
    component: lazy(() => import('views/shop-subscriptions')),
  },
];

export default ShopSubscriptionsRoutes;
