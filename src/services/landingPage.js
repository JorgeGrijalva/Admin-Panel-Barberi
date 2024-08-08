import request from './request';

const landingPageService = {
  getAll: (params) => request.get('dashboard/admin/landing-pages', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/landing-pages/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/landing-pages', data),
  update: (id, data) =>
    request.put(`dashboard/admin/landing-pages/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/landing-pages/delete`, { params }),
};

export default landingPageService;
