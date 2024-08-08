import request from './request';

const refundService = {
  getAll: (params) =>
    request.get('dashboard/admin/order-refunds/paginate', { params }),
  getList: (params) => request.get('dashboard/user/order-refunds', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/order-refunds/${id}`, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/order-refunds/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/order-refunds/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/order-refunds/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/order-refunds/restore/all`),
};

export default refundService;
