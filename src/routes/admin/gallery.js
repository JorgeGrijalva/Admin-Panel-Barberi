// ** React Imports
import { lazy } from 'react';

const GalleryRoutes = [
  {
    path: 'gallery',
    component: lazy(() => import('views/gallery')),
  },
  {
    path: 'gallery/:type',
    component: lazy(() => import('views/gallery/gallery-languages')),
  },
];

export default GalleryRoutes;
