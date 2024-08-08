import { lazy } from 'react';

const LooksRoutes = [
  {
    path: 'catalog/looks',
    component: lazy(() => import('views/looks')),
  },
  {
    path: 'catalog/looks/add',
    component: lazy(() => import('views/looks/add')),
  },
  {
    path: 'catalog/looks/:id',
    component: lazy(() => import('views/looks/edit')),
  },
];

export default LooksRoutes;
