import request from '../request';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/seller/orders/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/orders/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/orders', data),
  update: (id, data) => request.put(`dashboard/seller/orders/${id}`, data),
  calculate: (params) => request.get(`rest/order/products/calculate${params}`),
  updateStatus: (id, data) =>
    request.post(`dashboard/seller/order/${id}/status`, data),
  updateDelivery: (id, data) =>
    request.post(`dashboard/seller/order/${id}/deliveryman`, data),
  delete: (params) =>
    request.delete(`dashboard/seller/orders/delete`, { params }),
  replaceProduct: (id, data) =>
    request.put(`dashboard/seller/orders/${id}`, data, {}),
  updateTracking: (id, data) =>
    request.post(`dashboard/seller/order/${id}/tracking`, data),
};

export default orderService;
