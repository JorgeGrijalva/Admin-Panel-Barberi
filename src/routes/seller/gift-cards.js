import { lazy } from 'react';

const SellerGiftCardsRoutes = [
  {
    path: '/seller/gift-cards',
    component: lazy(() => import('views/seller-views/gift-cards')),
  },
  {
    path: '/seller/gift-cards/add',
    component: lazy(
      () => import('views/seller-views/gift-cards/gift-card-add'),
    ),
  },
  {
    path: '/seller/gift-cards/:id',
    component: lazy(
      () => import('views/seller-views/gift-cards/gift-card-edit'),
    ),
  },
];

export default SellerGiftCardsRoutes;
