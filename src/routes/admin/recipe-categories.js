// ** React Imports
import { lazy } from 'react';

const RecipeCategoriesRoutes = [
  {
    path: 'catalog/recipe-categories',
    component: lazy(() => import('views/recipe-categories')),
  },
  {
    path: 'recipe-category/add',
    component: lazy(() => import('views/recipe-categories/category-add')),
  },
  {
    path: 'recipe-category/edit/:uuid',
    component: lazy(() => import('views/recipe-categories/category-edit')),
  },
  {
    path: 'recipe-category-clone/:uuid',
    component: lazy(() => import('views/recipe-categories/category-clone')),
  },
  {
    path: 'recipe-categories/import',
    component: lazy(() => import('views/recipe-categories/category-import')),
  },
];

export default RecipeCategoriesRoutes;
