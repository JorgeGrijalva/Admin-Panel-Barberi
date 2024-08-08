// ** React Imports
import { lazy } from 'react';

const SellerSubscriptionsRoutes = [
  {
    path: 'subscriptions',
    component: lazy(() => import('views/subscriptions')),
  },
  {
    path: 'subscriptions/edit',
    component: lazy(() => import('views/subscriptions/subscriptions-edit')),
  },
];

export default SellerSubscriptionsRoutes;
