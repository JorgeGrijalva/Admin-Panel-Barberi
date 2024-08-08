import request from './request';

const formOptionService = {
  getAll: (params) => request.get('dashboard/admin/form-options', { params }),
  create: (body) => request.post('dashboard/admin/form-options', body),
  delete: (params) =>
    request.delete('dashboard/admin/form-options/delete', { params }),
  getById: (id) => request.get(`dashboard/admin/form-options/${id}`),
  update: (id, body) => request.put(`dashboard/admin/form-options/${id}`, body),
};

export default formOptionService;
