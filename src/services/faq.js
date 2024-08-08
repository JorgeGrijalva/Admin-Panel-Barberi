import request from './request';

const faqService = {
  getAll: (params) => request.get('dashboard/admin/faqs/paginate', { params }),
  getById: (uuid) => request.get(`dashboard/admin/faqs/${uuid}`),
  create: (data) => request.post('dashboard/admin/faqs', data),
  update: (uuid, data) => request.put(`dashboard/admin/faqs/${uuid}`, data),
  delete: (params) => request.delete(`dashboard/admin/faqs/delete`, { params }),
  setActive: (uuid) =>
    request.post(`dashboard/admin/faqs/${uuid}/active/status`),
};

export default faqService;
