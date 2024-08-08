// ** React Imports
import { lazy } from 'react';

const SellerCategoryImport = [
  {
    path: 'seller/categories',
    component: lazy(() => import('views/seller-views/categories')),
  },
  {
    path: 'seller/category/add',
    component: lazy(() => import('views/seller-views/categories/category-add')),
  },
  {
    path: 'seller/category/:uuid',
    component: lazy(
      () => import('views/seller-views/categories/category-edit'),
    ),
  },
  {
    path: 'seller/category/show/:uuid',
    component: lazy(
      () => import('views/seller-views/categories/category-show'),
    ),
  },
  {
    path: 'seller/category-request/:id',
    component: lazy(
      () => import('views/seller-views/categories/category-request-edit'),
    ),
  },
  {
    path: 'seller/catalog/categories/import',
    component: lazy(
      () => import('views/seller-views/categories/category-import'),
    ),
  },
  {
    path: 'seller/category-clone/:uuid',
    component: lazy(
      () => import('views/seller-views/categories/category-clone'),
    ),
  },
];

export default SellerCategoryImport;
