import request from './request';

const deliveryPriceService = {
  get: (params) => request.get('dashboard/admin/delivery-prices', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/delivery-prices/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/admin/delivery-prices/delete', { params }),
  create: (data) => request.post('dashboard/admin/delivery-prices', data),
  update: (id, data) =>
    request.put(`dashboard/admin/delivery-prices/${id}`, data),
};

export default deliveryPriceService;
