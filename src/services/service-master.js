import request from './request';

const serviceMasterService = {
  getAll: (params) =>
    request.get('dashboard/admin/service-masters', { params }),
  create: (data) => request.post('dashboard/admin/service-masters', data),
  update: (id, data) =>
    request.put(`dashboard/admin/service-masters/${id}`, data),
  getById: (id) => request.get(`dashboard/admin/service-masters/${id}`),
  delete: (params) =>
    request.delete('dashboard/admin/service-masters/delete', { params }),
};

export default serviceMasterService;
