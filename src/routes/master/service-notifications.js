import { lazy } from 'react';

const MasterServiceNotificationsRoutes = [
  {
    path: 'master/service-notifications',
    component: lazy(() => import('views/master-views/service-notifications')),
  },
  {
    path: 'master/service-notifications/add',
    component: lazy(
      () => import('views/master-views/service-notifications/add'),
    ),
  },
  {
    path: 'master/service-notifications/:id',
    component: lazy(
      () => import('views/master-views/service-notifications/edit'),
    ),
  },
];

export default MasterServiceNotificationsRoutes;
