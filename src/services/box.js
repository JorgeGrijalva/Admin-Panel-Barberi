import request from './request';

const boxService = {
  getAll: (params) => request.get('dashboard/admin/boxes', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/boxes/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/admin/boxes/delete', { params }),
  create: (data) => request.post('dashboard/admin/boxes', data),
  update: (id, data) => request.put(`dashboard/admin/boxes/${id}`, data),
};

export default boxService;
