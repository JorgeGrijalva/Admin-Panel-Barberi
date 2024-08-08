import { lazy } from 'react';

const SellerBookingRoutes = [
  {
    path: 'seller/bookings',
    component: lazy(() => import('views/seller-views/bookings')),
  },
  {
    path: 'seller/bookings-report',
    component: lazy(() => import('views/seller-views/bookings-report')),
  },
];

export default SellerBookingRoutes;
