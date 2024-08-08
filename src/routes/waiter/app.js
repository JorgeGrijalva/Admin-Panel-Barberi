// ** React Imports
import { lazy } from 'react';

const WaiterAppRoutes = [
  {
    path: 'my-shop',
    component: lazy(() => import('views/waiter-views/order')),
  },
];

export default WaiterAppRoutes;
