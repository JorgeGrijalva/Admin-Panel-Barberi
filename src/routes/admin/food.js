// ** React Imports
import { lazy } from 'react';

const FoodRoutes = [
  {
    path: 'catalog/products',
    component: lazy(() => import('views/products')),
  },
  {
    path: 'product/add',
    component: lazy(() => import('views/products/products-add')),
  },
  {
    path: 'product/:uuid',
    component: lazy(() => import('views/products/product-edit')),
  },
  {
    path: 'product-clone/:uuid',
    component: lazy(() => import('views/products/product-clone')),
  },
  {
    path: 'catalog/product/import',
    component: lazy(() => import('views/products/product-import')),
  },
  {
    path: 'product-request/:id',
    component: lazy(() => import('views/products/product-request-edit')),
  },
  {
    path: 'product-request-details/:id',
    component: lazy(() => import('views/products/product-request-detail')),
  },
];

export default FoodRoutes;
