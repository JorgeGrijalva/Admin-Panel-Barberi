// ** React Imports
import { lazy } from 'react';

const SellerBookingTableRoutes = [
  {
    path: 'seller/booking/tables',
    component: lazy(() => import('views/seller-views/booking-table')),
  },
  {
    path: 'seller/booking/table/add',
    component: lazy(() => import('views/seller-views/booking-table/table-add')),
  },
  {
    path: 'seller/booking/table/:id',
    component: lazy(() =>
      import('views/seller-views/booking-table/table-edit')
    ),
  },
  {
    path: 'seller/booking/table/clone/:id',
    component: lazy(() =>
      import('views/seller-views/booking-table/table-clone')
    ),
  },
];

export default SellerBookingTableRoutes;
