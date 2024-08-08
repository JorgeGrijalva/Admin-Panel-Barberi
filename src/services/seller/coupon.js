import request from '../request';

const sellerCouponService = {
  getAll: (params) =>
    request.get('dashboard/seller/coupons/paginate', { ...params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/coupons/${id}`, { params }),
  create: (params) => request.post('dashboard/seller/coupons', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/seller/coupons/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/coupons/delete`, { params }),
  dropAll: () => request.get(`dashboard/seller/coupons/drop/all`),
  restoreAll: () => request.get(`dashboard/seller/coupons/restore/all`),
};

export default sellerCouponService;
