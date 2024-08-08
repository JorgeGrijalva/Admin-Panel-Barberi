// ** React Imports
import { lazy } from 'react';

const SettingsRoutes = [
  {
    path: 'settings',
    component: lazy(() => import('views/settings/settings')),
  },
  {
    path: 'settings/general',
    component: lazy(() => import('views/settings/general-settings')),
  },
  {
    path: 'settings/referal',
    component: lazy(() => import('views/settings/referral-setting')),
  },
  {
    path: 'settings/referal',
    component: lazy(() => import('views/settings/referral-setting')),
  },
  {
    path: 'settings/translations',
    component: lazy(() => import('views/translations')),
  },
  {
    path: 'settings/translations/import',
    component: lazy(() => import('views/translations/import')),
  },
  {
    path: 'settings/backup',
    component: lazy(() => import('views/backup')),
  },
  {
    path: 'settings/cashClear',
    component: lazy(() => import('views/cache')),
  },
  {
    path: 'settings/system-information',
    component: lazy(() => import('views/system-information')),
  },
  {
    path: 'settings/payments',
    component: lazy(() => import('views/payments')),
  },
  {
    path: 'settings/terms',
    component: lazy(() => import('views/privacy/terms')),
  },
  {
    path: 'settings/policy',
    component: lazy(() => import('views/privacy/policy')),
  },
  {
    path: 'settings/update',
    component: lazy(() => import('views/update')),
  },
  {
    path: 'settings/firebase',
    component: lazy(() => import('views/settings/firebaseConfig')),
  },
  {
    path: 'settings/social',
    component: lazy(() => import('views/settings/socialSettings')),
  },
  {
    path: 'settings/orderStatus',
    component: lazy(() => import('views/order-status')),
  },
  {
    path: 'settings/emailProviders',
    component: lazy(() => import('views/email-provider')),
  },
  {
    path: 'settings/app',
    component: lazy(() => import('views/settings/app-setting')),
  },
];

export default SettingsRoutes;
