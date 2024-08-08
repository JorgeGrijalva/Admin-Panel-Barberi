import request from './request';

const serviceNotificationsService = {
  create: (data) =>
    request.post('dashboard/admin/service-master-notifications', data),
  getAll: (params) =>
    request.get('dashboard/admin/service-master-notifications', { params }),
  delete: (params) =>
    request.delete('dashboard/admin/service-master-notifications/delete', {
      params,
    }),
  update: (id, data) =>
    request.put(`dashboard/admin/service-master-notifications/${id}`, data),
  getById: (id) =>
    request.get(`dashboard/admin/service-master-notifications/${id}`),
};

export default serviceNotificationsService;
