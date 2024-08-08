import request from './request';

const url = 'dashboard/admin/services';

const servicesService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id, params) => request.get(`${url}/${id}`, { params }),
  create: (data) => request.post(url, data, {}),
  update: (id, data) => request.put(`${url}/${id}`, data, {}),
  delete: (params) => request.delete(`${url}/delete`, { params }),
  statusChange: (id, data) => request.put(`${url}/${id}`, data),
  createExtras: (id, data) =>
    request.post(`dashboard/admin/services/${id}/extras`, data),
  createFaqs: (id, data) =>
    request.post(`dashboard/admin/services/${id}/faqs`, data),
};

export default servicesService;
