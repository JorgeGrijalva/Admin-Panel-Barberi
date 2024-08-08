// ** React Imports
import { lazy } from 'react';

const SellerPropertyImport = [
  {
    path: 'property',
    component: lazy(() =>
      import('views/seller-views/products/property/property-group')
    ),
  },
  {
    path: 'property/value',
    component: lazy(() =>
      import('views/seller-views/products/property/property-value')
    ),
  },
  {
    path: 'catalog/property/value',
    component: lazy(() =>
      import('views/seller-views/products/property/property-value')
    ),
  },
];

export default SellerPropertyImport;
