import request from './request';

const paymentService = {
  getAll: (params) => request.get('dashboard/admin/payments', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/payments/${id}`, { params }),
  update: (id, data) => request.put(`dashboard/admin/payments/${id}`, data),
  setActive: (id) =>
    request.post(`dashboard/admin/payments/${id}/active/status`, {}),
};

export default paymentService;
