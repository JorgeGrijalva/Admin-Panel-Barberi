import request from './request';

const languagesService = {
  getAllActive: (params) => request.get('rest/languages/active', { params }),
  getAll: (params) => request.get('dashboard/admin/languages', { params }),
  setDefault: (id) => request.post(`dashboard/admin/languages/default/${id}`),
  delete: (params) =>
    request.delete(`dashboard/admin/languages/delete`, { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/languages/${id}`, { params }),
  create: (data) => request.post(`dashboard/admin/languages`, data),
  update: (id, data) => request.put(`dashboard/admin/languages/${id}`, data),
};

export default languagesService;
