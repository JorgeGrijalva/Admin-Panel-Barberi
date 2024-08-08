import request from '../request';

const sellerDeliveryPriceService = {
  get: (params) => request.get('dashboard/seller/delivery-prices', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/delivery-prices/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/seller/delivery-prices/delete', { params }),
  create: (data) => request.post('dashboard/seller/delivery-prices', data),
  update: (id, data) =>
    request.put(`dashboard/seller/delivery-prices/${id}`, data),
};

export default sellerDeliveryPriceService;
