// ** React Imports
import { lazy } from 'react';

const CouponRoutes = [
  {
    path: 'coupons',
    component: lazy(() => import('views/coupons')),
  },
  {
    path: 'coupon/add',
    component: lazy(() => import('views/coupons/coupon-add')),
  },
  {
    path: 'coupon/:id',
    component: lazy(() => import('views/coupons/coupon-edit')),
  },
];

export default CouponRoutes;
