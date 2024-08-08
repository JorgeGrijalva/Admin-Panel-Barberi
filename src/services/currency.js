import request from './request';

const currencyService = {
  getAll: (params) => request.get('dashboard/admin/currencies', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/currencies/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/currencies', data),
  update: (id, data) => request.put(`dashboard/admin/currencies/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/currencies/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/currencies/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/currencies/restore/all`),
};

export default currencyService;
