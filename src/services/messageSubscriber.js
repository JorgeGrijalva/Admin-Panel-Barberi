import request from './request';

const messageSubscriberService = {
  getAll: (params) =>
    request.get('dashboard/admin/email-templates', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/email-templates/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/email-templates', data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/email-templates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/email-templates/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/email-templates/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/email-templates/restore/all`),
};

export default messageSubscriberService;
