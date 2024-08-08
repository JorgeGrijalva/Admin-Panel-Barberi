import request from './request';

const blogService = {
  getAll: (params) => request.get('dashboard/admin/blogs/paginate', { params }),
  getById: (id) => request.get(`dashboard/admin/blogs/${id}`),
  create: (data) => request.post('dashboard/admin/blogs', data),
  update: (id, data) => request.put(`dashboard/admin/blogs/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/blogs/delete`, { params }),
  setActive: (id) => request.post(`dashboard/admin/blogs/${id}/active/status`),
  publish: (id) => request.post(`dashboard/admin/blogs/${id}/publish`),
  dropAll: () => request.get(`dashboard/admin/blogs/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/blogs/restore/all`),
};

export default blogService;
