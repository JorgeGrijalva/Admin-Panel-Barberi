// ** React Imports
import { lazy } from 'react';

const CareerRoutes = [
  {
    path: 'careers/list',
    component: lazy(() => import('views/career-map')),
  },
  {
    path: 'catalog/career',
    component: lazy(() => import('views/career')),
  },
  {
    path: 'career/add',
    component: lazy(() => import('views/career/career-add')),
  },
  {
    path: 'career/:id',
    component: lazy(() => import('views/career/career-edit')),
  },
  {
    path: 'career-clone/:id',
    component: lazy(() => import('views/career/career-clone')),
  },
];

export default CareerRoutes;
