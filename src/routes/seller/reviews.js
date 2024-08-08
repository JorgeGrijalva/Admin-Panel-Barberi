// ** React Imports
import { lazy } from 'react';

const ReviewRoutes = [
  {
    path: 'seller/reviews',
    component: lazy(() => import('views/seller-views/reviews')),
  },
  {
    path: 'seller/reviews/product',
    component: lazy(() => import('views/seller-views/reviews/productReviews')),
  },
  {
    path: 'seller/reviews/order',
    component: lazy(() => import('views/seller-views/reviews/orderReviews')),
  },
  {
    path: 'seller/reviews/deliveryboy',
    component: lazy(() =>
      import('views/seller-views/reviews/deliveryBoyReviews')
    ),
  },
];

export default ReviewRoutes;
