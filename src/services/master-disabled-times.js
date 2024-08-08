import request from './request';

const url = 'dashboard/admin/master-disabled-times';

export const masterDisabledTimesServices = {
  getAll: (params = {}) => request.get(url, { params }),
  getById: (id, params = {}) => request.get(`${url}/${id}`, { params }),
  create: (params) => request.post(url, null, { params }),
  update: (id, data) => request.put(`${url}/${id}`, data),
  delete: (params) => request.delete(`${url}/delete`, { params }),
};
