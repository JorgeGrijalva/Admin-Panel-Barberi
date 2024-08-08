// ** React Imports
import { lazy } from 'react';

const ReceptRoutes = [
  {
    path: 'catalog/recept',
    component: lazy(() => import('views/recepts')),
  },
  {
    path: 'recept/add',
    component: lazy(() => import('views/recepts/recept-add')),
  },
  {
    path: 'recept/edit/:id',
    component: lazy(() => import('views/recepts/recept-edit')),
  },
];

export default ReceptRoutes;
