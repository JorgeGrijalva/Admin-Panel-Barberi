import request from './request';

const shopAdsService = {
  getAll: (params) =>
    request.get('dashboard/admin/shop-ads-packages', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/shop-ads-packages/${id}`, { params }),
  update: (id, data) =>
    request.put(`dashboard/admin/shop-ads-packages/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/admin/shop-ads-packages/delete', { params }),
  setActive: (id) =>
    request.get(`dashboard/admin/shop-ads-packages/${id}/active`),
  updateStatus: (uuid, params) =>
    request.post(
      `dashboard/admin/shop-ads-packages/${uuid}/status/change`,
      {},
      { params },
    ),
  transactionUpdate: (id, params) =>
    request.put(`payments/ads/${id}/transactions`, null, { params }),
};

export default shopAdsService;
