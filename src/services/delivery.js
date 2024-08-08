import request from './request';

const deliveryService = {
  get: (params) => request.get('dashboard/admin/users/paginate', { params }),
  getAll: (params) =>
    request.get('dashboard/admin/deliveryman/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/deliveryman-settings/${id}`, { params }),
  create: (data) =>
    request.post('dashboard/admin/deliveryman-settings', data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/deliveryman-settings/${id}`, data, {}),
  getTypes: (params) =>
    request.get(`dashboard/admin/delivery/types`, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/users/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/deliverymans/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/deliverymans/restore/all`),
};

export default deliveryService;
