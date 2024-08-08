// ** React Imports
import { lazy } from 'react';

const ShopCategoryRoutes = [
  {
    path: 'catalog/shop/categories',
    component: lazy(() => import('views/shop-categories')),
  },
  {
    path: 'shop/category/add',
    component: lazy(() => import('views/shop-categories/category-add')),
  },
  {
    path: 'shop/category/:uuid',
    component: lazy(() => import('views/shop-categories/category-edit')),
  },
  {
    path: 'shop/category-clone/:uuid',
    component: lazy(() => import('views/shop-categories/category-clone')),
  },
  {
    path: 'catalog/shop/categories/import',
    component: lazy(() => import('views/shop-categories/category-import')),
  },
];

export default ShopCategoryRoutes;
