// ** React Imports
import { lazy } from 'react';

const ExtrasRoutes = [
  {
    path: 'catalog/extras/list',
    component: lazy(() => import('views/extras')),
  },
  {
    path: 'catalog/extras',
    component: lazy(() => import('views/products/Extras/extra-group')),
  },
  {
    path: 'catalog/extras/value',
    component: lazy(() => import('views/products/Extras/extra-value')),
  },
];

export default ExtrasRoutes;
