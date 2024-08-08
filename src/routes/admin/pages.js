// ** React Imports
import { lazy } from 'react';

const PagesRoutes = [
  {
    path: 'pages',
    component: lazy(() => import('views/pages')),
  },
  {
    path: 'page/add',
    component: lazy(() => import('views/pages/page-add')),
  },
  {
    path: 'page/:id',
    component: lazy(() => import('views/pages/page-edit')),
  },
];

export default PagesRoutes;
