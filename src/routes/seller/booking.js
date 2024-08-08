import { lazy } from 'react';

const sellerBookingRoutes = [
  {
    path: 'seller/bookingList',
    component: lazy(() => import('views/seller-views/booking-list')),
  },
];

export default sellerBookingRoutes;
