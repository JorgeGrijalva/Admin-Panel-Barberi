import request from '../request';

const masterFormOptionsService = {
  getAll: (params) => request.get('dashboard/master/form-options', { params }),
  create: (data) => request.post('dashboard/master/form-options', data),
  delete: (params) =>
    request.delete('dashboard/master/form-options/delete', {
      params,
    }),
  update: (id, data) =>
    request.put(`dashboard/master/form-options/${id}`, data),
  getById: (id) => request.get(`dashboard/master/form-options/${id}`),
};

export default masterFormOptionsService;
