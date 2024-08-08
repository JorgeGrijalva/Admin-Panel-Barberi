import { lazy } from 'react';

const PaymentToPartnersRoutes = [
  {
    path: 'payments/:type',
    component: lazy(() => import('views/payment-to-partners')),
  },
  {
    path: 'withdraws/:type',
    component: lazy(() => import('views/payment-to-partners/list')),
  },
  {
    path: 'completed-withdraws/:type',
    component: lazy(() => import('views/payment-to-partners/copleted-list')),
  },
];

export default PaymentToPartnersRoutes;
