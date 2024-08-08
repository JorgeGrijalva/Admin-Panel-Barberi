import { lazy } from 'react';

const GiftCardsRoutes = [
  {
    path: 'gift-cards',
    component: lazy(() => import('views/gift-cards')),
  },
  {
    path: 'gift-cards/add',
    component: lazy(() => import('views/gift-cards/gift-card-add')),
  },
  {
    path: 'gift-cards/:id',
    component: lazy(() => import('views/gift-cards/gift-card-edit')),
  },
];

export default GiftCardsRoutes;
