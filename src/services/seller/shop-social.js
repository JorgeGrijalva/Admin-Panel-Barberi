import request from '../request';

const sellerShopSocialService = {
  getAll: (params) => request.get('dashboard/seller/shop-socials', { params }),
  create: (params) => request.post('dashboard/seller/shop-socials', params),
  update: (params) =>
    request.put(`dashboard/seller/shop-socials`, {}, { params }),
};

export default sellerShopSocialService;
