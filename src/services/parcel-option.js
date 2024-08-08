import request from './request';

const parcelOptionService = {
  getAll: (params) => request.get('dashboard/admin/parcel-options', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/parcel-options/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/parcel-options', data ),
  update: (id, data) =>
    request.put(`dashboard/admin/parcel-options/${id}`, data ),
  delete: (params) =>
    request.delete(`dashboard/admin/parcel-options/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/parcel-options/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/parcel-options/restore/all`),
};

export default parcelOptionService;
