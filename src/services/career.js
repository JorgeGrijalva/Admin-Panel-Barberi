import request from './request';

const careerService = {
  getAll: (params) => request.get('dashboard/admin/careers', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/careers/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/careers', data, {}),
  update: (id, data) => request.put(`dashboard/admin/careers/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/careers/delete`, { params }),
};

export default careerService;
