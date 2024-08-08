import request from './request';

const shopService = {
  get: (params) => request.get('dashboard/admin/shops', { params }),
  getAll: (params) => request.get('dashboard/admin/shops/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/shops/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/shops', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/shops/${id}`, {}, { params }),
  setVerify: (uuid) => request.post(`dashboard/admin/shops/${uuid}/verify`, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/shops/delete`, { params }),
  search: (params) => request.get('dashboard/admin/shops/search', { params }),
  getShopDeliveries: (params) =>
    request.get(`rest/shops/deliveries`, { params }),
  statusChange: (id, params) =>
    request.post(`dashboard/admin/shops/${id}/status/change`, {}, { params }),
  selectPaginate: (params) =>
    request
      .get('rest/shops/select-paginate', { params })
      .then((res) => res.data),

  dropAll: () => request.get(`dashboard/admin/shops/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/shops/restore/all`),
};

export default shopService;
