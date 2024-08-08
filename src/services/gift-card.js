import request from './request';

const GiftCardService = {
  create: (data) => request.post('dashboard/admin/gift-carts', data),
  getAll: (params) => request.get('dashboard/admin/gift-carts', { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/gift-carts/delete`, { params }),
  getById: (id) => request.get(`dashboard/admin/gift-carts/${id}`),
  update: (id, body) => request.put(`dashboard/admin/gift-carts/${id}`, body),
};

export default GiftCardService;
