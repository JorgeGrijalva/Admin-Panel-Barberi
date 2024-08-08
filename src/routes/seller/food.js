// ** React Imports
import { lazy } from 'react';

const SellerFoodRoutes = [
  {
    path: 'seller/products',
    component: lazy(() => import('views/seller-views/products/products')),
  },
  {
    path: 'seller/product/add',
    component: lazy(() => import('views/seller-views/products/products-add')),
  },
  {
    path: 'seller/product/:uuid',
    component: lazy(() => import('views/seller-views/products/product-edit')),
  },
  {
    path: 'seller/product-clone/:uuid',
    component: lazy(() => import('views/seller-views/products/product-clone')),
  },
  {
    path: 'seller/product/import',
    component: lazy(() => import('views/seller-views/products/product-import')),
  },
  {
    path: 'seller/product-request/:id',
    component: lazy(() =>
      import('views/seller-views/products/product-request-edit')
    ),
  },
];

export default SellerFoodRoutes;
