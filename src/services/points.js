import request from './request';

const pointService = {
  getAll: (params) =>
    request.get('dashboard/admin/points/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/points/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/points', data),
  update: (id, data) => request.put(`dashboard/admin/points/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/points/delete`, { params }),
  setActive: (id) => request.post(`dashboard/admin/points/${id}/active`),
  dropAll: () => request.get(`dashboard/admin/points/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/points/restore/all`),
};

export default pointService;
