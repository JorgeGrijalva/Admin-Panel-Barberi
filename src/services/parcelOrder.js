import request from './request';
import requestWithoutTimeout from './requestWithoutTimeout';

const parcelOrderService = {
  getAll: (params) => request.get('dashboard/admin/parcel-orders', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/parcel-orders/${id}`, { params }),
  export: (params) =>
    requestWithoutTimeout.get(`dashboard/admin/parcel-order/export`, {
      params,
    }),
  create: (data) => request.post('dashboard/admin/parcel-orders', data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/parcel-orders/${id}`, data),
  calculate: (params) =>
    request.get(`rest/parcel-order/calculate-price`, { params }),
  updateStatus: (id, data) =>
    request.post(`dashboard/admin/parcel-order/${id}/status`, data),
  updateDelivery: (id, data) =>
    request.post(`dashboard/admin/parcel-order/${id}/deliveryman`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/parcel-orders/delete`, { params }),
  transaction: (id, data) =>
    request.post(`payments/parcel-order/${id}/transactions`, data),
  transactionStatus: (id, params) =>
    request.put(`payments/parcel-order/${id}/transactions`, null, {
      params,
    }),
};

export default parcelOrderService;
