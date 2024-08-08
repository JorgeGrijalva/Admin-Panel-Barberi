import request from '../request';

const sellerBrand = {
  getAll: (params) =>
    request.get('dashboard/seller/brands/paginate', { params }),
  getById: (uuid, params) =>
    request.get(`dashboard/seller/brands/${uuid}`, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/brands/delete`, { params }),
  create: (params) => request.post('dashboard/seller/brands', {}, { params }),
  update: (uuid, params) =>
    request.put(`dashboard/seller/brands/${uuid}`, {}, { params }),
  search: (params) =>
    request.get('dashboard/seller/brands/all-category', { params }),
  select: (params) =>
    request.get('dashboard/seller/brands/select-paginate', { params }),
};

export default sellerBrand;
