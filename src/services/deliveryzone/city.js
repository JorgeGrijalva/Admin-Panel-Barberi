import request from '../request';

const cityService = {
  get: (params) => request.get('dashboard/admin/cities', { params }),
  show: (id, params) => request.get(`dashboard/admin/cities/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/cities', data),
  update: (id, data) => request.put(`dashboard/admin/cities/${id}`, data),
  delete: (id) => request.delete(`dashboard/admin/cities/delete?ids[0]=${id}`),
  status: (id) => request.get(`dashboard/admin/city/${id}/active`),
};

export default cityService;
