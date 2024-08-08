// ** React Imports
import { lazy } from 'react';

const AddonRoutes = [
  {
    path: 'catalog/addons',
    component: lazy(() => import('views/addons')),
  },
  {
    path: 'addon/add',
    component: lazy(() => import('views/addons/addons-add')),
  },
  {
    path: 'addon/:uuid',
    component: lazy(() => import('views/addons/addons-edit')),
  },
  {
    path: 'addon-clone/:uuid',
    component: lazy(() => import('views/addons/addons-clone')),
  },
  {
    path: 'catalog/addon/import',
    component: lazy(() => import('views/addons/addons-import')),
  },
];

export default AddonRoutes;
