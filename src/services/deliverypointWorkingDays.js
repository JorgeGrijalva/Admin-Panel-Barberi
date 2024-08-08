import request from './request';

const deliveryPointWorkingDays = {
  getById: (id) =>
    request.get(`dashboard/admin/delivery-point-working-days/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/delivery-point-working-days`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/delivery-point-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/delivery-point-working-days`, { params }),
};

export default deliveryPointWorkingDays;
