import { lazy } from 'react';

const MasterServiceRoutes = [
  {
    path: 'master/calendar',
    component: lazy(() => import('views/master-views/calendar')),
  },
  {
    path: 'master/service-master',
    component: lazy(() =>
      import('views/master-views/service-master/service-master.js')
    ),
  },
  {
    path: 'master/service-master/add',
    component: lazy(() =>
      import('views/master-views/service-master/service-master-add')
    ),
  },
  {
    path: 'master/service-master/:id',
    component: lazy(() =>
      import('views/master-views/service-master/service-master-edit')
    ),
  },
];

export default MasterServiceRoutes;
