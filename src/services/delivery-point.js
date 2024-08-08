import request from './request';

const deliveryPointService = {
  get: (params) => request.get('dashboard/admin/delivery-points', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/delivery-points/${id}`, { params }),
  delete: (params) =>
    request.delete('dashboard/admin/delivery-points/delete', { params }),
  create: (data) => request.post('dashboard/admin/delivery-points', data),
  update: (id, data) =>
    request.put(`dashboard/admin/delivery-points/${id}`, data),
};

export default deliveryPointService;
