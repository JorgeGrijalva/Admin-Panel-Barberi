import request from '../request';

const url = 'dashboard/master/galleries';

const masterGalleryService = {
  getAll: (params) => request.get(`${url}`, { params }),
  create: (params) => request.post(`${url}`, params),
};

export default masterGalleryService;
