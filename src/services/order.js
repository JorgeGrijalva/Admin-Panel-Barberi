import request from './request';
import requestWithoutTimeout from './requestWithoutTimeout';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/admin/orders/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/orders/${id}`, { params }),
  export: (params) =>
    requestWithoutTimeout.get(`dashboard/admin/order/export`, { params }),
  create: (data) => request.post('dashboard/admin/orders', data, {}),
  update: (id, data) => request.put(`dashboard/admin/orders/${id}`, data),
  calculate: (params) =>
    request.get(`dashboard/admin/order/products/calculate${params}`),
  updateStatus: (id, data) =>
    request.post(`dashboard/admin/order/${id}/status`, data, {}),
  updateDelivery: (id, params) =>
    request.post(`dashboard/admin/order/${id}/deliveryman`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/orders/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/orders/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/orders/restore/all`),
  getAllUserOrder: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}/paginate`, { params }),
  getUserTopProducts: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}`, { params }),
  replaceProduct: (id, data) =>
    request.put(`dashboard/admin/orders/${id}`, data, {}),
  updateTracking: (id, data) =>
    request.post(`dashboard/admin/order/${id}/tracking`, data),
  getByParentId: (id, params) =>
    request.get(`dashboard/admin/orders/${id}/get-all`),
};

export default orderService;
