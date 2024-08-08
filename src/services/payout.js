import request from './request';

export const payoutService = {
  getAll: (params) => request.get('dashboard/admin/payouts', { params }),
  create: (data) =>
    request.post('dashboard/admin/payouts', {}, { params: data }),
  update: (id, data) => request.put(`dashboard/admin/payouts/${id}`, data),
  changeStatus: (id, data) =>
    request.post(`dashboard/admin/payouts/${id}/status`, data),
};
