import request from '../request';

const workingDays = {
  getById: (id) => request.get(`dashboard/seller/shop-working-days/${id}`),
  create: (data) => request.post(`dashboard/seller/shop-working-day`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/seller/shop-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/shop-working-days`, { params }),
};

export default workingDays;
