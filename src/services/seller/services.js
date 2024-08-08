import request from '../request';

const url = 'dashboard/seller/services';

const servicesService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id, params) => request.get(`${url}/${id}`, { params }),
  create: (data) => request.post(url, data, {}),
  update: (id, data) => request.put(`${url}/${id}`, data, {}),
  delete: (params) => request.delete(`${url}/delete`, { params }),
  statusChange: (id, data) => request.put(`${url}/${id}`, data),
  getAllExtras: (params) =>
    request.get('dashboard/seller/service-extras', { params }),
  createExtras: (id, data) => request.post(`${url}/${id}/extras`, data),
  createFaqs: (id, data) => request.post(`${url}/${id}/faqs`, data),
};

export default servicesService;
