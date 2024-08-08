import request from '../request';

const storeisService = {
  getAll: (params) => request.get('dashboard/seller/stories', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/stories/${id}`, { params }),
  create: (params) => request.post('dashboard/seller/stories', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/seller/stories/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/stories/delete`, { params }),
  setStatus: (id, data) =>
    request.post(`dashboard/admin/tickets/${id}/status`, data),
  getStatus: (params) =>
    request.get(`dashboard/admin/tickets/statuses`, { params }),
};

export default storeisService;
