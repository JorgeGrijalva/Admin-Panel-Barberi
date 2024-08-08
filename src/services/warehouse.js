import request from './request';

const warehouseService = {
  get: (params) => request.get('dashboard/admin/warehouses', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/warehouses/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/admin/warehouses/delete', { params }),
  create: (data) => request.post('dashboard/admin/warehouses', data),
  update: (id, data) => request.put(`dashboard/admin/warehouses/${id}`, data),
};

export default warehouseService;
