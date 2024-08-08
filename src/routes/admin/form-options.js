import { lazy } from 'react';

const FormOptionsRoutes = [
  {
    path: '/form-options',
    component: lazy(() => import('views/form-options')),
  },
  {
    path: '/form-options/add',
    component: lazy(() => import('views/form-options/form-options-add')),
  },
  {
    path: '/form-options/:id',
    component: lazy(() => import('views/form-options/form-options-edit')),
  },
];

export default FormOptionsRoutes;
