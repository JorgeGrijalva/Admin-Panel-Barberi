import request from '../request';

const categoryService = {
  getAll: (params) =>
    request.get('dashboard/seller/categories/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/categories/${id}`, { params }),
  search: (params) =>
    request.get('dashboard/seller/categories/search', { params }),
  paginateSelect: (params) =>
    request.get('dashboard/seller/categories/select-paginate', { params }),
};

export default categoryService;
