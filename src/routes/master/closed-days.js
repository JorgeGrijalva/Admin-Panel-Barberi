import { lazy } from 'react';

const MasterClosedDaysRoutes = [
  {
    path: 'master/closed-days',
    component: lazy(() => import('views/master-views/closed-days/closed-days')),
  },
];

export default MasterClosedDaysRoutes;
