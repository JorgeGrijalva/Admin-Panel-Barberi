import { lazy } from 'react';

const BookingRoutes = [
  {
    path: 'booking',
    component: lazy(() => import('views/booking')),
  },
];

export default BookingRoutes;
