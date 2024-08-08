// ** React Imports
import { lazy } from 'react';

const SellerReceptCategoryRoutes = [
  {
    path: 'seller/recipe-categories',
    component: lazy(() => import('views/seller-views/recipe-categories')),
  },
  {
    path: 'seller/recipe-category/add',
    component: lazy(() =>
      import('views/seller-views/recipe-categories/category-add')
    ),
  },
  {
    path: 'seller/recipe-category/edit/:uuid',
    component: lazy(() =>
      import('views/seller-views/recipe-categories/category-edit')
    ),
  },
  {
    path: 'seller/recipe-category-clone/:uuid',
    component: lazy(() =>
      import('views/seller-views/recipe-categories/category-clone')
    ),
  },
  {
    path: 'seller/recipe-categories/import',
    component: lazy(() =>
      import('views/seller-views/recipe-categories/category-import')
    ),
  },
];

export default SellerReceptCategoryRoutes;
