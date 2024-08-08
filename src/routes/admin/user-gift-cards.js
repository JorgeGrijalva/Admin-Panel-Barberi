import { lazy } from 'react';

const UserGiftCardsRoutes = [
  {
    path: 'user-gift-cards',
    component: lazy(() => import('views/user-gift-cards')),
  },
];

export default UserGiftCardsRoutes;
