import { lazy } from 'react';

const SellerServiceMasterRoutes = [
  {
    path: 'seller/service-master',
    component: lazy(() => import('views/seller-views/service-master')),
  },
  {
    path: 'seller/service-master/add',
    component: lazy(() => import('views/seller-views/service-master/add')),
  },
  {
    path: 'seller/service-master/:id',
    component: lazy(() => import('views/seller-views/service-master/edit')),
  },
];

export default SellerServiceMasterRoutes;
