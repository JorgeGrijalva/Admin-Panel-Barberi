import request from './request';

const deliveryPointCloseDates = {
  getById: (id) =>
    request.get(`dashboard/admin/delivery-point-closed-dates/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/delivery-point-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/delivery-point-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/shop-closed-dates/delete`, { params }),
};

export default deliveryPointCloseDates;
