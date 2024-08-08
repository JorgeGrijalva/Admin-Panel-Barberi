import request from '../request';

const deliveryService = {
  get: (params) => request.get('dashboard/seller/deliveries', { params }),
  getAll: (params) =>
    request.get('dashboard/seller/deliveries/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/deliveries/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/deliveries', data),
  update: (id, data) => request.put(`dashboard/seller/deliveries/${id}`, data),
  getTypes: (params) =>
    request.get(`dashboard/seller/deliveries/types`, { params }),
  setActive: (id, data) =>
    request.post(`dashboard/seller/deliveries/${id}/active/status`, data),
};

export default deliveryService;
