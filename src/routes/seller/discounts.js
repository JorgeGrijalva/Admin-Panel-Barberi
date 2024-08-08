// ** React Imports
import { lazy } from 'react';

const SellerDiscountsRoutes = [
  {
    path: 'seller/discounts',
    component: lazy(() => import('views/seller-views/discounts')),
  },
  {
    path: 'discount/add',
    component: lazy(() => import('views/seller-views/discounts/discount-add')),
  },
  {
    path: 'discount/:id',
    component: lazy(() => import('views/seller-views/discounts/discount-edit')),
  },
];

export default SellerDiscountsRoutes;
