import { lazy } from 'react';

const DeliveryPriceRoutes = [
  {
    path: 'delivery-price',
    component: lazy(() => import('views/delivery-price')),
  },
  {
    path: 'delivery-price/add',
    component: lazy(() => import('views/delivery-price/price-add')),
  },
  {
    path: 'delivery-price/:id',
    component: lazy(() => import('views/delivery-price/price-edit')),
  },
];

export default DeliveryPriceRoutes;
