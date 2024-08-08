import { lazy } from 'react';

const SellerDeliverymenRoutes = [
  {
    path: 'seller/deliverymen',
    component: lazy(() => import('views/seller-views/deliverymen')),
  },
  {
    path: 'seller/deliverymen/add',
    component: lazy(() => import('views/seller-views/deliverymen/add')),
  },
];

export default SellerDeliverymenRoutes;
