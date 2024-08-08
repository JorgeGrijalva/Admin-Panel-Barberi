// ** React Imports
import { lazy } from 'react';

const ServiceCategoryRoutes = [
  {
    path: 'catalog/service-categories',
    component: lazy(() => import('views/service-category')),
  },
  {
    path: 'service-category/add',
    component: lazy(
      () => import('views/service-category/service-category-add'),
    ),
  },
  {
    path: 'service-category/:uuid',
    component: lazy(
      () => import('views/service-category/service-category-edit'),
    ),
  },
  {
    path: 'service-category/edit',
    component: lazy(
      () => import('views/service-category/service-category-show'),
    ),
  },
  {
    path: 'service-category/show/:uuid',
    component: lazy(
      () => import('views/service-category/service-category-show'),
    ),
  },
  {
    path: 'service-category-clone/:uuid',
    component: lazy(
      () => import('views/service-category/service-category-clone'),
    ),
  },
  {
    path: 'catalog/service-category/import',
    component: lazy(
      () => import('views/service-category/service-category-import'),
    ),
  },
];

export default ServiceCategoryRoutes;
