import { lazy } from 'react';

const SellerDeliveryPriceRoutes = [
  {
    path: 'seller/delivery-price',
    component: lazy(() => import('views/seller-views/delivery-price')),
  },
  {
    path: 'seller/delivery-price/add',
    component: lazy(() =>
      import('views/seller-views/delivery-price/price-add'),
    ),
  },
  {
    path: 'seller/delivery-price/:id',
    component: lazy(() =>
      import('views/seller-views/delivery-price/price-edit'),
    ),
  },
];

export default SellerDeliveryPriceRoutes;
