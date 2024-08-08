// ** React Imports
import { lazy } from 'react';

const WaiterOrderRoutes = [
  {
    path: 'waiter/orders',
    component: lazy(() => import('views/waiter-views/order')),
  },
  {
    path: 'waiter/orders/:type',
    component: lazy(() => import('views/waiter-views/order')),
  },
  {
    path: 'waiter/orders-board',
    component: lazy(() => import('views/waiter-views/order/orders-board')),
  },
  {
    path: 'waiter/orders/generate-invoice/:id',
    component: lazy(() => import('components/check')),
  },
  {
    path: 'waiter/orders-board/:type',
    component: lazy(() => import('views/waiter-views/order/orders-board')),
  },
  {
    path: 'waiter/order/details/:id',
    component: lazy(() => import('views/waiter-views/order/order-details')),
  },
  {
    path: 'waiter/order/:id',
    component: lazy(() => import('views/waiter-views/order/order-edit')),
  },
];

export default WaiterOrderRoutes;
