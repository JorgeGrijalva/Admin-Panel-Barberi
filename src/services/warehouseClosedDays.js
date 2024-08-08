import request from './request';

const deliveryPointCloseDates = {
  getById: (id) => request.get(`dashboard/admin/warehouse-closed-dates/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/warehouse-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/warehouse-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/warehouse-closed-dates/delete`, { params }),
};

export default deliveryPointCloseDates;
