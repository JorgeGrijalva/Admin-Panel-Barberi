import request from './request';

const PagesService = {
  getAll: (params) => request.get('dashboard/admin/pages', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/pages/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/pages', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/pages/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/pages/delete`, { params }),
};

export default PagesService;
