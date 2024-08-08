// ** React Imports
import { lazy } from 'react';

const SellerBookingZoneRoutes = [
  {
    path: 'seller/booking/zone',
    component: lazy(() => import('views/seller-views/booking-zone')),
  },
  {
    path: 'seller/booking/zone/add',
    component: lazy(() => import('views/seller-views/booking-zone/zone-add')),
  },
  {
    path: 'seller/booking/zone/:id',
    component: lazy(() => import('views/seller-views/booking-zone/zone-edit')),
  },
];

export default SellerBookingZoneRoutes;
