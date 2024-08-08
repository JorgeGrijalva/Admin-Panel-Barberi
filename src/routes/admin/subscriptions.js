// ** React Imports
import { lazy } from 'react';

const SubscriptionsRoutes = [
  {
    path: 'subscriptions',
    component: lazy(() => import('views/subscriptions')),
  },
  {
    path: 'subscriptions/edit',
    component: lazy(() => import('views/subscriptions/subscriptions-edit')),
  },
];

export default SubscriptionsRoutes;
