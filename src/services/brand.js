import request from './request';
import requestWithoutTimeout from './requestWithoutTimeout';

const brandService = {
  get: (params) => request.get('dashboard/admin/brands', { params }),
  getAll: (params) =>
    request.get('dashboard/admin/brands/paginate', { params }),
  export: (params) =>
    requestWithoutTimeout.get('dashboard/admin/brands/export', { params }),
  import: (data) => request.post('dashboard/admin/brands/import', data),
  getById: (id, params) =>
    requestWithoutTimeout.get(`dashboard/admin/brands/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/brands', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/brands/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/brands/delete`, { params }),
  search: (params) => request.get(`dashboard/admin/brands/search`, { params }),
  dropAll: () => request.get(`dashboard/admin/brands/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/brands/restore/all`),
};

export default brandService;
