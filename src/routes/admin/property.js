// ** React Imports
import { lazy } from 'react';

const PropertiesRoutes = [
  {
    path: 'catalog/properties/list',
    component: lazy(() => import('views/properties')),
  },
  {
    path: 'catalog/properties',
    component: lazy(() => import('views/products/properties/property-group')),
  },
  {
    path: 'catalog/properties/value',
    component: lazy(() => import('views/products/properties/property-value')),
  },
];

export default PropertiesRoutes;
