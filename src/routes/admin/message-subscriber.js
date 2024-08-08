// ** React Imports
import { lazy } from 'react';

const MessageSubscriber = [
  {
    path: 'message/subscriber',
    component: lazy(() => import('views/message-subscribers')),
  },
  {
    path: 'message/subscriber/add',
    component: lazy(() => import('views/message-subscribers/subciribed-add')),
  },
  {
    path: 'message/subscriber/:id',
    component: lazy(() => import('views/message-subscribers/subciribed-edit')),
  },
];

export default MessageSubscriber;
