// ** React Imports
import { lazy } from 'react';

const SellerBookingTimeRoutes = [
  {
    path: 'seller/booking/time',
    component: lazy(() => import('views/seller-views/booking-time')),
  },
  {
    path: 'seller/booking/time/add',
    component: lazy(() => import('views/seller-views/booking-time/time-add')),
  },
  {
    path: 'seller/booking/time/:id',
    component: lazy(() => import('views/seller-views/booking-time/time-edit')),
  },
];

export default SellerBookingTimeRoutes;
