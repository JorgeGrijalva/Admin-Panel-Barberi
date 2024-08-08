import request from './request';
import requestWithoutTimeout from './requestWithoutTimeout';

const translationService = {
  getAll: (params) =>
    request.get('dashboard/admin/translations/paginate', { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/translations/delete`, { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/translations/${id}`, { params }),
  create: (params) =>
    request.post(`dashboard/admin/translations`, {}, { params }),
  update: (key, params) =>
    request.put(`dashboard/admin/translations/${key}`, {}, { params }),
  export: (params) =>
    request.get(`dashboard/admin/translations/export`, { params }),
  import: (data) =>
    requestWithoutTimeout.post('dashboard/admin/translations/import', data),
};

export default translationService;
