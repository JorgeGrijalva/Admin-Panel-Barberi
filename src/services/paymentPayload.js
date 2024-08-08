import request from './request';

export const paymentPayloadService = {
  getAll: (params) =>
    request.get('dashboard/admin/payment-payloads', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/payment-payloads/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/payment-payloads', data),
  update: (id, data) =>
    request.put(`dashboard/admin/payment-payloads/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/payment-payloads/delete`, { params }),
};