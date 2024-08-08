// ** React Imports
import { lazy } from 'react';

const CurrencyRoutes = [
  {
    path: 'currencies',
    component: lazy(() => import('views/currencies')),
  },
  {
    path: 'currency/add',
    component: lazy(() => import('views/currencies/currencies-add')),
  },
  {
    path: 'currency/:id',
    component: lazy(() => import('views/currencies/currency-edit')),
  },
];

export default CurrencyRoutes;
