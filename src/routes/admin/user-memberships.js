import { lazy } from 'react';

const UserMembershipsRoutes = [
  {
    path: '/user-memberships',
    component: lazy(() => import('views/user-memberships')),
  },
];

export default UserMembershipsRoutes;
