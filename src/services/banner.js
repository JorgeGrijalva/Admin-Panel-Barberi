import request from './request';

const bannerService = {
  getAll: (params) =>
    request.get('dashboard/admin/banners/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/banners/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/banners', data, {}),
  update: (id, data) => request.put(`dashboard/admin/banners/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/banners/delete`, { params }),
  setActive: (id) => request.post(`dashboard/admin/banners/active/${id}`),
  dropAll: () => request.get(`dashboard/admin/banners/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/banners/restore/all`),
};

export default bannerService;
