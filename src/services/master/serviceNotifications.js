import request from '../request';

const serviceNotificationsService = {
  create: (data) =>
    request.post('dashboard/master/service-master-notifications', data),
  getAll: (params) =>
    request.get('dashboard/master/service-master-notifications', { params }),
  delete: (params) =>
    request.delete('dashboard/master/service-master-notifications/delete', {
      params,
    }),
  update: (id, data) =>
    request.put(`dashboard/master/service-master-notifications/${id}`, data),
  getById: (id) =>
    request.get(`dashboard/master/service-master-notifications/${id}`),
};

export default serviceNotificationsService;
