import request from '../request';

const refundService = {
  getAll: (params) =>
    request.get('dashboard/seller/order-refunds/paginate', { params }),
  getList: (params) => request.get('dashboard/user/order-refunds', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/order-refunds/${id}`, { params }),
  update: (id, params) =>
    request.put(`dashboard/seller/order-refunds/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/order-refunds/delete`, { params }),
};

export default refundService;
