import request from './request';

const workingDays = {
  getById: (id) => request.get(`dashboard/admin/shop-working-days/${id}`),
  create: (data) => request.post(`dashboard/admin/shop-working-day`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/shop-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/shop-working-days`, { params }),
};

export default workingDays;
