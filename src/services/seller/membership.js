import request from '../request';

const url = 'dashboard/seller/memberships';

const membershipService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id) => request.get(`${url}/${id}`),
  create: (data) => request.post(url, data),
  update: (id, data) => request.put(`${url}/${id}`, data),
  delete: (params) => request.delete(`${url}/delete`, { params }),
};

export default membershipService;
