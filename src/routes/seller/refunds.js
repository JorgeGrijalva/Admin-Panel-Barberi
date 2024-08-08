// ** React Imports
import { lazy } from 'react';

const SellerRefundsRoutes = [
  {
    path: 'refunds',
    component: lazy(() => import('views/refund')),
  },
  {
    path: 'refund/details/:id',
    component: lazy(() => import('views/refund/refund-details')),
  },
];

export default SellerRefundsRoutes;
