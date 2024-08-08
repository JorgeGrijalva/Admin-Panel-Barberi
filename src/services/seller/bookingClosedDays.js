import request from '../request';

const bookingClosedDays = {
  getById: (id) =>
    request.get(`dashboard/seller/booking/shop-closed-dates/${id}`),
  create: (data) =>
    request.post(`dashboard/seller/booking/shop-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/seller/booking/shop-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/booking/shop-closed-dates/delete`, {
      params,
    }),
};

export default bookingClosedDays;
