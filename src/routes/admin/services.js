import { lazy } from 'react';

const ServicesRoutes = [
  {
    path: 'services',
    component: lazy(() => import('views/services')),
  },
  {
    path: 'services/add',
    component: lazy(() => import('views/services/create')),
  },
  {
    path: 'services/:id',
    component: lazy(() => import('views/services/edit')),
  },
];

export default ServicesRoutes;
