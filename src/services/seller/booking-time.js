import request from '../request';

const sellerBookingTime = {
  getAll: (params) => request.get('dashboard/seller/bookings', { params }),
  getById: (id) => request.get(`dashboard/seller/bookings/${id}`),
  create: (data) => request.post('dashboard/seller/bookings', data),
  update: (id, data) => request.put(`dashboard/seller/bookings/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/seller/bookings/delete', { params }),
};

export default sellerBookingTime;
