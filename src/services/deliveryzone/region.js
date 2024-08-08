import request from '../request';

const regionService = {
  get: (params) => request.get('dashboard/admin/regions', { params }),
  show: (id, params) =>
    request.get(`dashboard/admin/regions/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/regions', data),
  update: (id, data) => request.put(`dashboard/admin/regions/${id}`, data),
  delete: (id) => request.delete(`dashboard/admin/regions/delete?ids[0]=${id}`),
  status: (id) => request.get(`dashboard/admin/region/${id}/active`),
};

export default regionService;
