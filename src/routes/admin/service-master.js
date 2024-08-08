import { lazy } from 'react';

const AdminServiceMasterRoutes = [
  {
    path: 'service-master',
    component: lazy(() => import('views/service-master')),
  },
  {
    path: 'service-master/add',
    component: lazy(() => import('views/service-master/add')),
  },
  {
    path: 'service-master/:id',
    component: lazy(() => import('views/service-master/edit')),
  },
];

export default AdminServiceMasterRoutes;
