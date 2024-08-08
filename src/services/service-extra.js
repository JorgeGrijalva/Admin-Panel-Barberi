import request from './request';

const serviceExtraService = {
  create: (data) => request.post('dashboard/admin/service-extras', data),
  getAll: (params) => request.get('dashboard/admin/service-extras', { params }),
  delete: (params) =>
    request.delete('dashboard/admin/service-extras/delete', { params }),
  getById: (id) => request.get(`dashboard/admin/service-extras/${id}`),
  update: (id, data) =>
    request.put(`dashboard/admin/service-extras/${id}`, data),
};

export default serviceExtraService;
