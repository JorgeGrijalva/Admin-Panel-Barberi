// ** React Imports
import { lazy } from 'react';

const SellerPaymentRoutes = [
  {
    path: 'seller/payments',
    component: lazy(() => import('views/seller-views/payment')),
  },
  {
    path: 'seller/payments/add',
    component: lazy(() => import('views/seller-views/payment/payment-add')),
  },
  {
    path: 'seller/payments/:id',
    component: lazy(() => import('views/seller-views/payment/payment-edit')),
  },
];

export default SellerPaymentRoutes;
