import request from './request';

const bookingService = {
  getAll: (params) => request.get('dashboard/admin/bookings', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/bookings/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/admin/bookings/delete', { params }),
  create: (data) => request.post('dashboard/admin/bookings', data),
  update: (id, data) => request.put(`dashboard/admin/bookings/${id}`, data),
  calculate: (data) => request.post(`dashboard/admin/bookings/calculate`, data),
  getBookingById: (id, params) =>
    request.get(`dashboard/admin/bookings/${id}/get-all`, { params }),
  changeStatus: (id, data) =>
    request.post(`dashboard/admin/bookings/${id}/status/update`, data),
  updateNote: (id, data) =>
    request.post(`dashboard/admin/bookings/${id}/notes/update`, data),
};

export default bookingService;
