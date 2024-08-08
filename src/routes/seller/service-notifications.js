import { lazy } from 'react';

const SellerServiceNotificationsRoutes = [
  {
    path: 'seller/service-notifications',
    component: lazy(() => import('views/seller-views/service-notifications')),
  },
  {
    path: 'seller/service-notifications/add',
    component: lazy(
      () => import('views/seller-views/service-notifications/add'),
    ),
  },
  {
    path: 'seller/service-notifications/:id',
    component: lazy(
      () => import('views/seller-views/service-notifications/edit'),
    ),
  },
];

export default SellerServiceNotificationsRoutes;
