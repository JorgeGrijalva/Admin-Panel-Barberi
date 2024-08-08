// ** React Imports
import { lazy } from 'react';

const UnitRoutes = [
  {
    path: 'catalog/units',
    component: lazy(() => import('views/units')),
  },
  {
    path: 'unit/add',
    component: lazy(() => import('views/units/unit-add')),
  },
  {
    path: 'unit/:id',
    component: lazy(() => import('views/units/unit-edit')),
  },
];

export default UnitRoutes;
