// ** React Imports
import { lazy } from 'react';

const SMSPayloads = [
  {
    path: 'settings/sms-payload',
    component: lazy(() => import('views/sms-payload')),
  },
  {
    path: 'settings/sms-payload/add',
    component: lazy(() => import('views/sms-payload/sms-add')),
  },
  {
    path: 'settings/sms-payload/:type',
    component: lazy(() => import('views/sms-payload/sms-edit')),
  },
];

export default SMSPayloads;
