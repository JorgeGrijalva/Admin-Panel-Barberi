// ** React Imports
import { lazy } from 'react';

const BannerRoutes = [
  {
    path: 'banners',
    component: lazy(() => import('views/banners')),
  },
  {
    path: 'banner/add',
    component: lazy(() => import('views/banners/banner-add')),
  },
  {
    path: 'banner/:id',
    component: lazy(() => import('views/banners/banner-edit')),
  },
  {
    path: 'banner/clone/:id',
    component: lazy(() => import('views/banners/banner-clone')),
  },
];

export default BannerRoutes;
