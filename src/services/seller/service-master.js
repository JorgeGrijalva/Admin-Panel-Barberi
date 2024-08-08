import request from '../request';

const serviceMasterService = {
  getAll: (params) =>
    request.get('dashboard/seller/service-masters', { params }),
  create: (data) => request.post('dashboard/seller/service-masters', data),
  update: (id, data) =>
    request.put(`dashboard/seller/service-masters/${id}`, data),
  getById: (id) => request.get(`dashboard/seller/service-masters/${id}`),
  delete: (params) =>
    request.delete('dashboard/seller/service-masters/delete', { params }),
};

export default serviceMasterService;
