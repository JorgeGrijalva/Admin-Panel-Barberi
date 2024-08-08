import request from '../request';

const sellerBoxService = {
  getAll: (params) => request.get('dashboard/seller/boxes', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/boxes/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/seller/boxes/delete', { params }),
  create: (data) => request.post('dashboard/seller/boxes', data),
  update: (id, data) => request.put(`dashboard/seller/boxes/${id}`, data),
};

export default sellerBoxService;
