import { lazy } from 'react';

const WarehouseRoutes = [
  // {
  //   path: 'warehouse',
  //   component: lazy(() => import('views/warehouse')),
  // },
  {
    path: 'warehouse',
    component: lazy(() => import('views/warehouse/main')),
  },
  {
    path: 'warehouse/add',
    component: lazy(() => import('views/warehouse/main')),
  },
  {
    path: 'warehouse/:id',
    component: lazy(() => import('views/warehouse/main')),
  },
];

export default WarehouseRoutes;
