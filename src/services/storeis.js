import request from './request';

const storeisService = {
  getAll: (params) => request.get('dashboard/admin/stories', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/stories/${id}`, { params }),
};

export default storeisService;
