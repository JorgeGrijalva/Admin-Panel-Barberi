// ** React Imports
import { lazy } from 'react';

const BlogRoutes = [
  {
    path: 'blogs',
    component: lazy(() => import('views/blog')),
  },
  {
    path: 'blog/add',
    component: lazy(() => import('views/blog/blog-add')),
  },
  {
    path: 'blog/:uuid',
    component: lazy(() => import('views/blog/blog-edit')),
  },
  {
    path: 'blog/clone/:uuid',
    component: lazy(() => import('views/blog/blog-clone')),
  },
];

export default BlogRoutes;
