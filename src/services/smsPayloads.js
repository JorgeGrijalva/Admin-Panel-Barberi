import request from './request';

const smsService = {
  getAll: (params) => request.get('dashboard/admin/sms-payloads', { params }),
  getById: (type, params) =>
    request.get(`dashboard/admin/sms-payloads/${type}`, { params }),
  update: (id, data) => request.put(`dashboard/admin/sms-payloads/${id}`, data),
  create: (data) => request.post(`dashboard/admin/sms-payloads`, data),
  setActive: (id, data) =>
    request.post(`dashboard/admin/sms-payloads/${id}/active/status`, data),
};

export default smsService;
