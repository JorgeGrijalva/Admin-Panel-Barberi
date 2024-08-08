import { lazy } from 'react';

const Deliveryzone = [
  {
    path: 'deliveryzone/region',
    component: lazy(() => import('views/deliveryzone/region')),
  },
  {
    path: 'deliveryzone/country',
    component: lazy(() => import('views/deliveryzone/country')),
  },
  {
    path: 'deliveryzone/city',
    component: lazy(() => import('views/deliveryzone/city')),
  },
  {
    path: 'deliveryzone/area',
    component: lazy(() => import('views/deliveryzone/area')),
  },
];

export default Deliveryzone;
