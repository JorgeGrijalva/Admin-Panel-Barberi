// ** React Imports
import { lazy } from 'react';

const RestraurantRoutes = [
  {
    path: 'restaurants',
    component: lazy(() => import('views/restaurant')),
  },
  {
    path: 'restaurant/add',
    component: lazy(() => import('views/restaurant/restaurant-add')),
  },
  {
    path: 'restaurant/:uuid',
    component: lazy(() => import('views/restaurant/restaurant-edit')),
  },
  {
    path: 'restaurant-clone/:uuid',
    component: lazy(() => import('views/restaurant/restaurant-clone')),
  },
];

export default RestraurantRoutes;
