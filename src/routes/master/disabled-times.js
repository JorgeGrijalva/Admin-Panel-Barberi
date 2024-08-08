import { lazy } from 'react';

const MasterDisabledTimesRoutes = [
  {
    path: 'master/disabled-times',
    component: lazy(
      () => import('views/master-views/disabled-times/disabled-times'),
    ),
  },
  {
    path: 'master/disabled-time/add',
    component: lazy(
      () => import('views/master-views/disabled-times/disabled-time-add'),
    ),
  },
  {
    path: 'master/disabled-time/:id',
    component: lazy(
      () => import('views/master-views/disabled-times/disabled-time-edit'),
    ),
  },
];

export default MasterDisabledTimesRoutes;
