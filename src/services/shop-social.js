import request from './request';

const shopSocialService = {
  getAll: (params) => request.get('dashboard/admin/shop-socials', { params }),
  create: (params) => request.post('dashboard/admin/shop-socials', params),
  update: (params) =>
    request.put(`dashboard/seller/shop-socials`, {}, { params }),
};

export default shopSocialService;
