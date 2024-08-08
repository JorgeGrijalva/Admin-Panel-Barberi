import request from './request';

const emailService = {
  get: (params) => request.get(`dashboard/admin/email-settings`, { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/email-settings/${id}`, { params }),
  setActive: (id, params) =>
    request.get(`dashboard/admin/email-settings/set-active/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/email-settings', data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/email-settings/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/email-settings/delete`, { params }),
};

export default emailService;
