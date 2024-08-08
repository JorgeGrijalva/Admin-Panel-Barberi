import request from '../request';

const serviceNotificationsService = {
  create: (data) =>
    request.post('dashboard/seller/service-master-notifications', data),
  getAll: (params) =>
    request.get('dashboard/seller/service-master-notifications', { params }),
  delete: (params) =>
    request.delete('dashboard/seller/service-master-notifications/delete', {
      params,
    }),
  update: (id, data) =>
    request.put(`dashboard/seller/service-master-notifications/${id}`, data),
  getById: (id) =>
    request.get(`dashboard/seller/service-master-notifications/${id}`),
};

export default serviceNotificationsService;
