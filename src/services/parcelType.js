import request from './request';

const parcelTypeService = {
  getAll: (params) =>
    request.get('dashboard/admin/parcel-order-settings', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/parcel-order-settings/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/parcel-order-settings', data),
  update: (id, data) =>
    request.put(`dashboard/admin/parcel-order-settings/${id}`, data),
  delete: (params) =>
    request.delete(`dashboard/admin/parcel-order-settings/delete`, { params }),
};

export default parcelTypeService;
