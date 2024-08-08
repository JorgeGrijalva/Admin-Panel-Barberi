import request from '../request';

const propertyService = {
  getAllGroups: (params) =>
    request.get('dashboard/seller/property/groups', { params }),
  getGroupById: (id, params) =>
    request.get(`dashboard/seller/property/groups/${id}`, { params }),
  getGroupTypes: (params) =>
    request.get('dashboard/seller/property/groups/types', { params }),
  createGroup: (data) => request.post('dashboard/seller/property/groups', data),
  updateGroup: (id, data) =>
    request.put(`dashboard/seller/property/groups/${id}`, data),
  deleteGroup: (params) =>
    request.delete(`dashboard/seller/property/groups/delete`, { params }),
  dropAllGroup: () => request.get(`dashboard/seller/property/group/drop/all`),
  restoreAllGroup: () =>
    request.get(`dashboard/seller/property/group/restore/all`),

  getAllValues: (params) =>
    request.get('dashboard/seller/property/values', { params }),
  getValueById: (id, params) =>
    request.get(`dashboard/seller/property/values/${id}`, { params }),
  createValue: (params) =>
    request.post('dashboard/seller/property/values', {}, { params }),
  updateValue: (id, params) =>
    request.put(`dashboard/seller/property/values/${id}`, {}, { params }),
  deleteValue: (params) =>
    request.delete(`dashboard/seller/property/values/delete`, { params }),
  dropAllValue: () => request.get(`dashboard/seller/property/values/drop/all`),
  restoreAllValue: () =>
    request.get(`dashboard/seller/property/values/restore/all`),
};

export default propertyService;
