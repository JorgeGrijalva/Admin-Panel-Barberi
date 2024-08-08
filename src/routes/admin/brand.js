// ** React Imports
import { lazy } from 'react';

const BrandRoutes = [
  {
    path: 'catalog/brands',
    component: lazy(() => import('views/brands')),
  },
  {
    path: 'brand/add',
    component: lazy(() => import('views/brands/brands-add')),
  },
  {
    path: 'brand/:id',
    component: lazy(() => import('views/brands/brands-edit')),
  },
  {
    path: 'brand-clone/:id',
    component: lazy(() => import('views/brands/brands-clone')),
  },
  {
    path: 'catalog/brands/import',
    component: lazy(() => import('views/brands/brand-import')),
  },
];

export default BrandRoutes;
