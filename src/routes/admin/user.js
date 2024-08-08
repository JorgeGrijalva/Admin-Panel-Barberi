// ** React Imports
import { lazy } from 'react';

const UsersRoutes = [
  {
    path: 'users',
    component: lazy(() => import('views/user')),
  },
  {
    path: 'users/user',
    component: lazy(() => import('views/user/user')),
  },
  {
    path: 'users/admin',
    component: lazy(() => import('views/user/admin')),
  },
  {
    path: 'users/user/:id',
    component: lazy(() => import('views/user/user-detail')),
  },
  {
    path: 'users/role',
    component: lazy(() => import('views/user/role-list')),
  },
  {
    path: 'user/add',
    component: lazy(() => import('views/user/user-add')),
  },
  {
    path: 'user/add/:role',
    component: lazy(() => import('views/user/user-add-role')),
  },
  {
    path: 'user/:uuid',
    component: lazy(() => import('views/user/user-edit')),
  },
  {
    path: 'user-clone/:uuid',
    component: lazy(() => import('views/user/user-clone')),
  },
  {
    path: 'wallets',
    component: lazy(() => import('views/wallet')),
  },
];

export default UsersRoutes;
