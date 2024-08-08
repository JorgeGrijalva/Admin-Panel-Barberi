import request from './request';

const deliveryPointWorkingDays = {
  getById: (id) => request.get(`dashboard/admin/warehouse-working-days/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/warehouse-working-days`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/warehouse-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/warehouse-working-days`, { params }),
};

export default deliveryPointWorkingDays;
