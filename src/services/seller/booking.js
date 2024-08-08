import request from '../request';

const url = 'dashboard/seller/bookings';

const sellerBookingService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id) => request.get(`${url}/${id}`),
  create: (data) => request.post(`${url}`, data),
  update: (id, data) => request.put(`${url}/${id}`, data),
  delete: (params) => request.delete(`${url}/delete`, { params }),
  calculate: (data) => request.post(`${url}/calculate`, data),
  changeStatus: (id, data) => request.post(`${url}/${id}/status/update`, data),
  getBookingById: (id, params) =>
    request.get(`${url}/${id}/get-all`, { params }),
  updateNote: (id, data) => request.post(`${url}/${id}/notes/update`, data),
};

export default sellerBookingService;
