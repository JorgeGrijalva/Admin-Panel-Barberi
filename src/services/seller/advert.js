import request from '../request';

const advertService = {
  getAll: (params) => request.get('dashboard/seller/ads-packages', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/ads-packages/${id}`, { params }),
  create: (data) => request.post(`dashboard/seller/shop-ads-packages`, data),
  update: (id, data) => request.put(`dashboard/admin/ads-packages/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/ads-packages/delete`, { params }),
  purchase: (id, data) => request.post(`payments/ads/${id}/transactions`, data),
  shopAdList: (params) =>
    request.get('dashboard/seller/shop-ads-packages', { params }),
};

export default advertService;
