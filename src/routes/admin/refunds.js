// ** React Imports
import { lazy } from 'react';

const RefundsRoutes = [
  {
    path: 'refunds',
    component: lazy(() => import('views/refund')),
  },
  {
    path: 'refund/details/:id',
    component: lazy(() => import('views/refund/refund-details')),
  },
];

export default RefundsRoutes;
