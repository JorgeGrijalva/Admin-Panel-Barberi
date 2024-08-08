// ** React Imports
import { lazy } from 'react';

const ReceptRoutes = [
  {
    path: 'seller/recept',
    component: lazy(() => import('views/seller-views/recepts')),
  },
  {
    path: 'seller/recept/add',
    component: lazy(() => import('views/seller-views/recepts/recept-add')),
  },
  {
    path: 'seller/recept/edit/:id',
    component: lazy(() => import('views/seller-views/recepts/recept-edit')),
  },
];

export default ReceptRoutes;
