// ** React Imports
import { lazy } from 'react';

const ParcelOrderRoutes = [
  {
    path: 'parcel-orders',
    component: lazy(() => import('views/parcel-order')),
  },
  {
    path: 'parcel-orders/add',
    component: lazy(() => import('views/parcel-order/parcel-order-add')),
  },
  {
    path: 'parcel-orders/:id',
    component: lazy(() => import('views/parcel-order/parcel-order-edit')),
  },
  {
    path: 'parcel-types',
    component: lazy(() => import('views/parcel-types')),
  },
  {
    path: 'parcel-types/add',
    component: lazy(() => import('views/parcel-types/parcel-type')),
  },
  {
    path: 'parcel-types/:id',
    component: lazy(() => import('views/parcel-types/parcel-type')),
  },
  {
    path: 'options',
    component: lazy(() => import('views/parcel-options'))
  },
  {
    path: 'options/add',
    component: lazy(() => import('views/parcel-options/option-add'))
  },
  {
    path: "options/:id",
    component: lazy(() => import('views/parcel-options/option-edit'))
  }
];

export default ParcelOrderRoutes;
