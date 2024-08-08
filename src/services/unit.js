import request from './request';

const unitService = {
  getAll: (params) => request.get('dashboard/admin/units/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/units/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/units', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/units/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/units/delete`, { params }),
  setActive: (id) => request.post(`dashboard/admin/units/active/${id}`),
  dropAll: () => request.get(`dashboard/admin/units/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/units/restore/all`),
};

export default unitService;
