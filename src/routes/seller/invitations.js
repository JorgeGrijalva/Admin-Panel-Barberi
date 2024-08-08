import { lazy } from 'react';

const SellerInvitationRouts = [
  // master
  {
    path: 'seller/invitations/masters',
    component: lazy(() =>
      import('views/seller-views/master-invitations/index'),
    ),
  },
  {
    path: 'seller/invitations/masters/add',
    component: lazy(() => import('views/seller-views/master-invitations/add')),
  },
  {
    path: 'seller/invitations/masters/edit/:uuid',
    component: lazy(() => import('views/seller-views/master-invitations/edit')),
  },
  // deliverymen
  {
    path: 'seller/invitations/deliverymen',
    component: lazy(() => import('views/seller-views/deliverymen')),
  },
  {
    path: 'seller/invitations/deliverymen/add',
    component: lazy(() => import('views/seller-views/deliverymen/add')),
  },
  {
    path: 'seller/invitations/deliverymen/edit/:uuid',
    component: lazy(() => import('views/seller-views/deliverymen/edit')),
  },
];

export default SellerInvitationRouts;
