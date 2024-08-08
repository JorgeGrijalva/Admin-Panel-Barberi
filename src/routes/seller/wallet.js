import { lazy } from 'react';

const SellerWalletRoutes = [
  {
    path: 'seller/wallet',
    component: lazy(() => import('views/seller-views/wallet')),
  },
];

export default SellerWalletRoutes;
