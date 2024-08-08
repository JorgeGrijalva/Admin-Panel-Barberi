import { lazy } from 'react';

const SellerPaymentFromPaymentRoutes = [
  {
    path: 'seller/withdraws',
    component: lazy(() =>
      import('views/seller-views/payment-from-partner/copleted-list')
    ),
  },
];

export default SellerPaymentFromPaymentRoutes;
