// ** React Imports
import { lazy } from 'react';

const SellerCouponRoutes = [
    {
        path: 'seller/coupons',
        component: lazy(() => import('views/seller-views/coupons')),
    },
    {
        path: 'seller/coupons/add',
        component: lazy(() => import('views/seller-views/coupons/coupon-add')),
    },
    {
        path: 'seller/coupons/:id',
        component: lazy(() => import('views/seller-views/coupons/coupon-edit')),
    },
];

export default SellerCouponRoutes;
