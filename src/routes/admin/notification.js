// ** React Imports
import { lazy } from 'react';

const NotificationRoutes = [
  {
    path: 'notifications',
    component: lazy(() => import('views/notification')),
  },
  {
    path: 'notification/add',
    component: lazy(() => import('views/notification/notification-add')),
  },
  {
    path: 'notification/:uuid',
    component: lazy(() => import('views/notification/notification-edit')),
  },
  {
    path: 'notification-clone/:uuid',
    component: lazy(() => import('views/notification/notification-clone')),
  },
];

export default NotificationRoutes;
