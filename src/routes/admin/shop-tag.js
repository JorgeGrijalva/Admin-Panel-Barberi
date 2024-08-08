// ** React Imports
import { lazy } from 'react';

const ShopTag = [
  {
    path: 'shop-tag',
    component: lazy(() => import('views/shop-tag')),
  },
  {
    path: 'shop-tag/add',
    component: lazy(() => import('views/shop-tag/tag-add')),
  },
  {
    path: 'shop-tag/:id',
    component: lazy(() => import('views/shop-tag/tag-edit')),
  },
  {
    path: 'shop-tag/clone/:id',
    component: lazy(() => import('views/shop-tag/tag-clone')),
  },
];

export default ShopTag;
