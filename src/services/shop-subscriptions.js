import request from './request';

const ShopSubscriptionsService = {
  getAll: (params) =>
    request.get('dashboard/admin/shop-subscriptions', { params }),
  getById: (id) => request.get(`dashboard/admin/shop-subscriptions/${id}`),
};

export default ShopSubscriptionsService;
