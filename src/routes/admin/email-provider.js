// ** React Imports
import { lazy } from 'react';

const EmailProvidersRoutes = [
  {
    path: 'settings/emailProviders',
    component: lazy(() => import('views/email-provider')),
  },
  {
    path: 'settings/emailProviders/add',
    component: lazy(() => import('views/email-provider/email-add')),
  },
  {
    path: 'settings/emailProviders/:id',
    component: lazy(() => import('views/email-provider/email-edit')),
  },
];

export default EmailProvidersRoutes;
