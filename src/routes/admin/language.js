// ** React Imports
import { lazy } from 'react';

const LanguagesRoutes = [
  {
    path: 'settings/languages',
    component: lazy(() => import('views/languages')),
  },
  {
    path: 'language/add',
    component: lazy(() => import('views/languages/language-add')),
  },
  {
    path: 'language/:id',
    component: lazy(() => import('views/languages/language-add')),
  },
];

export default LanguagesRoutes;
