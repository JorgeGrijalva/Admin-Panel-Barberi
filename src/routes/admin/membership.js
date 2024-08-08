import { lazy } from 'react';

const MembershipRoutes = [
  {
    path: 'membership',
    component: lazy(() => import('views/membership')),
  },
  {
    path: 'membership/add',
    component: lazy(() => import('views/membership/add')),
  },
  {
    path: 'membership/edit/:id',
    component: lazy(() => import('views/membership/edit')),
  },
];

export default MembershipRoutes;
