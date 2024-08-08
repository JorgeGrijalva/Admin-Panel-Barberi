// ** React Imports
import { lazy } from 'react';

const PaymentPayloadsRoutes = [
  {
    path: 'payment-payloads',
    component: lazy(() => import('views/payment-payloads')),
  },
  {
    path: 'payment-payloads/add',
    component: lazy(() => import('views/payment-payloads/payload-add')),
  },
  {
    path: 'payment-payloads/edit/:id',
    component: lazy(() => import('views/payment-payloads/payload-edit')),
  },
];

export default PaymentPayloadsRoutes;
