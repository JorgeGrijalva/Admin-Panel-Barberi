import request from './request';

const userGiftCardsService = {
  getAll: (params) =>
    request.get('dashboard/admin/user-gift-carts', { params }),
  getById: (id) => request.get(`dashboard/admin/user-gift-carts/${id}`),
};

export default userGiftCardsService;
