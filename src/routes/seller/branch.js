// ** React Imports
import { lazy } from 'react';

const SellerBranchRoutes = [
  {
    path: 'seller/branch',
    component: lazy(() => import('views/seller-views/branch')),
  },
  {
    path: 'seller/branch/add',
    component: lazy(() => import('views/seller-views/branch/branch-add')),
  },
  {
    path: 'seller/branch/:id',
    component: lazy(() => import('views/seller-views/branch/branch-edit')),
  },
];

export default SellerBranchRoutes;
