import request from '../request';

const url = 'dashboard/master/services';

const servicesService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id, params) => request.get(`${url}/${id}`, { params }),
  create: (data) => request.post(url, data, {}),
  update: (id, data) => request.put(`${url}/${id}`, data, {}),
  delete: (params) => request.delete(`${url}/delete`, { params }),
  statusChange: (id, data) => request.put(`${url}/${id}`, data),
};

export default servicesService;
