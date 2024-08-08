import { lazy } from 'react';

const MasterFormOptionsRoutes = [
  {
    path: 'master/form-options',
    component: lazy(() => import('views/master-views/form-options')),
  },
  {
    path: 'master/form-options/add',
    component: lazy(
      () => import('views/master-views/form-options/form-options-add'),
    ),
  },
  {
    path: 'master/form-options/:id',
    component: lazy(
      () => import('views/master-views/form-options/form-options-edit'),
    ),
  },
];

export default MasterFormOptionsRoutes;
