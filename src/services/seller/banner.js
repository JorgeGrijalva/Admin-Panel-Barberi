import request from '../request';

const sellerBannerService = {
  getAll: (params) =>
    request.get('dashboard/seller/banners/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/banners/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/banners', data, {}),
  update: (id, data) => request.put(`dashboard/seller/banners/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/banners/delete`, { params }),
  setActive: (id) => request.post(`dashboard/seller/banners/active/${id}`),
  dropAll: () => request.get(`dashboard/seller/banners/drop/all`),
  restoreAll: () => request.get(`dashboard/seller/banners/restore/all`),
};

export default sellerBannerService;
