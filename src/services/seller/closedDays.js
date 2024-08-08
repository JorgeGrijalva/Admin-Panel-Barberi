import request from '../request';

const closeDates = {
  getById: (id) => request.get(`dashboard/seller/shop-closed-dates/${id}`),
  create: (data) =>
    request.post(`dashboard/seller/shop-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/seller/shop-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/shop-closed-dates`, { params }),
};

export default closeDates;
