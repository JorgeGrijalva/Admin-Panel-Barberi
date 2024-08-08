import request from '../request';

const bookingWorkingDays = {
  getById: (id) =>
    request.get(`dashboard/seller/booking/shop-working-days/${id}`),
  create: (data) =>
    request.post(`dashboard/seller/booking/shop-working-day`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/seller/booking/shop-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/booking/shop-working-days`, { params }),
};

export default bookingWorkingDays;
