// ** React Imports
import { lazy } from 'react';

const SellerExtrasImport = [
  {
    path: 'extras',
    component: lazy(() =>
      import('views/seller-views/products/Extras/extra-group')
    ),
  },
  {
    path: 'extras/value',
    component: lazy(() =>
      import('views/seller-views/products/Extras/extra-value')
    ),
  },
  {
    path: 'catalog/extras/value',
    component: lazy(() =>
      import('views/seller-views/products/Extras/extra-value')
    ),
  },
];

export default SellerExtrasImport;
