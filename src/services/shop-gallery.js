import request from './request';

const url = 'dashboard/admin/galleries';

const shopGalleryService = {
  getAll: (params) => request.get(`${url}`, { params }),
  create: (params) => request.post(`${url}`, params),
};

export default shopGalleryService;
