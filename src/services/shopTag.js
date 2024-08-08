import request from './request';

const shopTagService = {
  getAll: (params) => request.get('dashboard/admin/shop-tags', { params }),
  getAllSeller: (params) =>
    request.get('dashboard/seller/shop-tags/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/shop-tags/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/shop-tags', data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/shop-tags/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/shop-tags/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/shop-tags/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/shop-tags/restore/all`),
};

export default shopTagService;
