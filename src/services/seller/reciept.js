import request from '../request';

const sellerReceptService = {
  getAll: (params) => request.get('dashboard/seller/receipts', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/receipts/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/seller/receipts/delete', { params }),
  create: (data) => request.post('dashboard/seller/receipts', data),
  update: (id, data) => request.put(`dashboard/seller/receipts/${id}`, data),
};

export default sellerReceptService;
