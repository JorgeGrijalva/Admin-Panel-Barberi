import request from '../request';

const countryService = {
  get: (params) => request.get('dashboard/admin/countries', { params }),
  show: (id, params) =>
    request.get(`dashboard/admin/countries/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/countries', data),
  update: (id, data) => request.put(`dashboard/admin/countries/${id}`, data),
  delete: (id) =>
    request.delete(`dashboard/admin/countries/delete?ids[0]=${id}`),
  status: (id) => request.get(`dashboard/admin/country/${id}/active`),
};

export default countryService;
