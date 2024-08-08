// ** React Imports
import { lazy } from 'react';

const FaqRoutes = [
  {
    path: 'settings/faqs',
    component: lazy(() => import('views/faq')),
  },
  {
    path: 'faq/add',
    component: lazy(() => import('views/faq/faq-add')),
  },
  {
    path: 'faq/:uuid',
    component: lazy(() => import('views/faq/faq-edit')),
  },
];

export default FaqRoutes;
