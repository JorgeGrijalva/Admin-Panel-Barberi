import { lazy } from 'react';

const AdminServiceNotificationsRoutes = [
  {
    path: 'service-notifications',
    component: lazy(() => import('views/service-notifications')),
  },
  {
    path: 'service-notifications/add',
    component: lazy(() => import('views/service-notifications/add')),
  },
  {
    path: 'service-notifications/:id',
    component: lazy(() => import('views/service-notifications/edit')),
  },
];

export default AdminServiceNotificationsRoutes;
