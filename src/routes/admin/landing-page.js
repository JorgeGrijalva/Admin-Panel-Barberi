// ** React Imports
import { lazy } from 'react';

const LandingPageRoutes = [
  {
    path: 'settings/landing-page',
    component: lazy(() => import('views/landing-page')),
  },
  {
    path: 'settings/landing-page/add',
    component: lazy(() => import('views/landing-page/landing-page-add')),
  },
  {
    path: 'settings/landing-page/:id',
    component: lazy(() => import('views/landing-page/landing-page-edit')),
  },
];

export default LandingPageRoutes;
