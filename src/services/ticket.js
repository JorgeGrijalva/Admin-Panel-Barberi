import request from './request';

const ticketService = {
  getAll: (params) =>
    request.get('dashboard/admin/tickets/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/tickets/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/tickets', data),
  update: (id, data) => request.put(`dashboard/admin/tickets/${id}`, data),
  delete: (id) => request.delete(`dashboard/admin/tickets/${id}`),
  setStatus: (id, data) =>
    request.post(`dashboard/admin/tickets/${id}/status`, data),
  getStatus: (params) =>
    request.get(`dashboard/admin/tickets/statuses`, { params }),
};

export default ticketService;
