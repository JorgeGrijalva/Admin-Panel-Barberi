import { lazy } from 'react';

const MasterGalleryRoutes = [
  {
    path: 'master/gallery',
    component: lazy(() => import('views/master-views/gallery/gallery')),
  },
];

export default MasterGalleryRoutes;
