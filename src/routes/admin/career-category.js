// ** React Imports
import { lazy } from 'react';

const CareerCategoryRoutes = [
  {
    path: 'catalog/career-categories',
    component: lazy(() => import('views/career-categories')),
  },
  {
    path: 'career-categories/add',
    component: lazy(() =>
      import('views/career-categories/career-category-add')
    ),
  },
  {
    path: 'career-categories/:uuid',
    component: lazy(() =>
      import('views/career-categories/career-category-edit')
    ),
  },
  {
    path: 'career-categories-clone/:uuid',
    component: lazy(() =>
      import('views/career-categories/career-category-clone')
    ),
  },
];

export default CareerCategoryRoutes;
