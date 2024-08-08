import request from '../request';

const sellerFormOptionService = {
  getAll: (params) => request.get('dashboard/seller/form-options', { params }),
  create: (body) => request.post('dashboard/seller/form-options', body),
  delete: (params) =>
    request.delete('dashboard/seller/form-options/delete', { params }),
  getById: (id) => request.get(`dashboard/seller/form-options/${id}`),
  update: (id, body) =>
    request.put(`dashboard/seller/form-options/${id}`, body),
};

export default sellerFormOptionService;
