import { lazy } from 'react';

const SellerMySubscriptionsRoutes = [
  {
    path: '/seller/my-subscriptions',
    component: lazy(() => import('views/seller-views/my-subscriptions')),
  },
];

export default SellerMySubscriptionsRoutes;
