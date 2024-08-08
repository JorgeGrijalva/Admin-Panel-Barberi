import request from '../request';

const serviceMasterService = {
  get: (params) => request.get('/dashboard/master/service-masters', { params }),
  getById: (id) => request.get(`/dashboard/master/service-masters/${id}`),
  searchServices: (params) =>
    request.get('/dashboard/master/services', { params }),
  create: (data) => request.post('/dashboard/master/service-masters', data),
  update: (id, data) =>
    request.put(`/dashboard/master/service-masters/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/master/service-masters/delete', {
      params,
    }),
  show: (id) => request.get(`rest/masters/${id}`),
};

export default serviceMasterService;
