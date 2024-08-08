import request from './request';

const closeDates = {
  getById: (id) => request.get(`dashboard/admin/shop-closed-dates/${id}`),
  create: (data) => request.post(`dashboard/admin/shop-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/shop-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/shop-closed-dates/delete`, { params }),
};

export default closeDates;
