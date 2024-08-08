import request from '../request';

const areaService = {
  get: (params) => request.get('dashboard/admin/areas', { params }),
  show: (id, params) => request.get(`dashboard/admin/areas/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/areas', data),
  update: (id, data) => request.put(`dashboard/admin/areas/${id}`, data),
  delete: (id) => request.delete(`dashboard/admin/areas/delete?ids[0]=${id}`),
  status: (id) => request.get(`dashboard/admin/area/${id}/active`),
};

export default areaService;
