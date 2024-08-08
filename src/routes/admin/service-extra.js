import { lazy } from 'react';

const ServiceExtraRoutes = [
  {
    path: '/service-extra',
    component: lazy(() => import('views/service-extra')),
  },
  {
    path: '/service-extra/add',
    component: lazy(() => import('views/service-extra/create')),
  },
  {
    path: '/service-extra/:id',
    component: lazy(() => import('views/service-extra/edit')),
  },
];

export default ServiceExtraRoutes;
