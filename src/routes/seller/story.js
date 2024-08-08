// ** React Imports
import { lazy } from 'react';

const StoryRoutes = [
  {
    path: 'seller/stories',
    component: lazy(() => import('views/seller-views/story')),
  },
  {
    path: 'seller/story/add',
    component: lazy(() => import('views/seller-views/story/story-add')),
  },
  {
    path: 'seller/story/:id',
    component: lazy(() => import('views/seller-views/story/story-edit')),
  },
];

export default StoryRoutes;
