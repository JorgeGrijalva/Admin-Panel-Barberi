// ** React Imports
import { lazy } from 'react';

const SellerAddonRoutes = [
  {
    path: 'seller/addons',
    component: lazy(() => import('views/seller-views/addons')),
  },
  {
    path: 'seller/addon/add',
    component: lazy(() => import('views/seller-views/addons/addons-add')),
  },
  {
    path: 'seller/addon/:uuid',
    component: lazy(() => import('views/seller-views/addons/addons-edit')),
  },
  {
    path: 'seller/addon-clone/:uuid',
    component: lazy(() => import('views/seller-views/addons/addons-clone')),
  },
  {
    path: 'seller/addon/import',
    component: lazy(() => import('views/seller-views/addons/addons-import')),
  },
];

export default SellerAddonRoutes;
