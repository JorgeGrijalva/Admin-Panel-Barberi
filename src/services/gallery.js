import request from './request';

const galleryService = {
  getAll: (params) =>
    request.get('dashboard/galleries/storage/files', { params }),
  upload: (data) => request.post('dashboard/galleries', data),
  delete: (params) =>
    request.post('dashboard/galleries/storage/files/delete', {}, { params }),
  getFolders: (params) => request.get('dashboard/galleries/types', { params }),
  storeMany: (data) => request.post('dashboard/galleries/store-many', data),
};

export default galleryService;
