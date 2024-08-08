import { lazy } from 'react';

const Advert = [
  {
    path: 'catalog/advert',
    component: lazy(() => import('views/advert')),
  },
  {
    path: 'advert/add',
    component: lazy(() => import('views/advert/advert-add')),
  },
  {
    path: 'advert/:id',
    component: lazy(() => import('views/advert/advert-edit')),
  },
];

export default Advert;
