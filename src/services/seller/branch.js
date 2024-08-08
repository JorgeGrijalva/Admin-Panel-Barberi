import request from '../request';

const branchService = {
  getAll: (params) => request.get('dashboard/seller/branches', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/branches/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/branches', data, {}),
  update: (id, data) =>
    request.put(`dashboard/seller/branches/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/branches/delete`, { params }),
};

export default branchService;
