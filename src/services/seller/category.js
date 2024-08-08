import request from '../request';
import requestWithoutTimeout from '../requestWithoutTimeout';

const sellerCategory = {
  getAll: (params) => request.get('dashboard/seller/categories', { params }),
  selectPaginate: (params) =>
    request.get('dashboard/seller/categories/select-paginate', { params }),
  getById: (uuid, params) =>
    request.get(`dashboard/seller/categories/${uuid}`, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/categories/delete`, { params }),
  create: (params) =>
    request.post('dashboard/seller/categories', {}, { params }),
  update: (uuid, params) =>
    request.put(`dashboard/seller/categories/${uuid}`, {}, { params }),
  search: (params) =>
    request.get('dashboard/seller/categories/search', { params }),
  select: (params) =>
    request.get('dashboard/seller/categories/select-paginate', { params }),
  setActive: (id) => request.post(`dashboard/seller/categories/${id}/active`),
  export: (params) =>
    requestWithoutTimeout.get('dashboard/seller/categories/export', { params }),
  import: (data, params) =>
    requestWithoutTimeout.post('dashboard/seller/categories/import', data, {
      params,
    }),
};

export default sellerCategory;
