import { lazy } from 'react';

const DeliveryPointRoutes = [
  {
    path: 'delivery-point',
    component: lazy(() => import('views/delivery-point')),
  },
  {
    path: 'delivery-point/add',
    component: lazy(() => import('views/delivery-point/main')),
  },
  {
    path: 'delivery-point/:id',
    component: lazy(() => import('views/delivery-point/main')),
  },
];

export default DeliveryPointRoutes;
