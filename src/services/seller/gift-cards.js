import request from '../request';

const SellerGiftCardService = {
  create: (data) => request.post('dashboard/seller/gift-carts', data),
  getAll: (params) => request.get('dashboard/seller/gift-carts', { params }),
  getById: (id) => request.get(`dashboard/seller/gift-carts/${id}`),
  update: (id, data) => request.put(`dashboard/seller/gift-carts/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/seller/gift-carts/delete', { params }),
};

export default SellerGiftCardService;
