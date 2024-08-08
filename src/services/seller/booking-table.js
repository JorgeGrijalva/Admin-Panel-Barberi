import request from '../request';

const sellerBookingTable = {
  getAll: (params) => request.get('dashboard/seller/tables', { params }),
  checkTable: (id, params) =>
    request.get(`dashboard/seller/disable-dates/table/${id}`, { params }),
  getById: (id) => request.get(`dashboard/seller/tables/${id}`),
  create: (data) => request.post('dashboard/seller/tables', data),
  update: (id, data) => request.put(`dashboard/seller/tables/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/seller/tables/delete', { params }),
};

export default sellerBookingTable;
