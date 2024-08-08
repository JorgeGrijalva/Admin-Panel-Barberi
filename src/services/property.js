import request from './request';

const propertyService = {
  getAllGroups: (params) =>
    request.get('dashboard/admin/property/groups', { params }),
  getGroupById: (id, params) =>
    request.get(`dashboard/admin/property/groups/${id}`, { params }),
  getGroupTypes: (params) =>
    request.get('dashboard/admin/property/groups/types', { params }),
  createGroup: (data) => request.post('dashboard/admin/property/groups', data),
  updateGroup: (id, data) =>
    request.put(`dashboard/admin/property/groups/${id}`, data),
  deleteGroup: (params) =>
    request.delete(`dashboard/admin/property/groups/delete`, { params }),
  dropAllGroup: () => request.get(`dashboard/admin/property/group/drop/all`),
  restoreAllGroup: () =>
    request.get(`dashboard/admin/property/group/restore/all`),

  getAllValues: (params) =>
    request.get('dashboard/admin/property/values', { params }),
  getValueById: (id, params) =>
    request.get(`dashboard/admin/property/values/${id}`, { params }),
  createValue: (params) =>
    request.post('dashboard/admin/property/values', {}, { params }),
  updateValue: (id, params) =>
    request.put(`dashboard/admin/property/values/${id}`, {}, { params }),
  deleteValue: (params) =>
    request.delete(`dashboard/admin/property/values/delete`, { params }),
  dropAllValue: () => request.get(`dashboard/admin/property/values/drop/all`),
  restoreAllValue: () =>
    request.get(`dashboard/admin/property/values/restore/all`),
};

export default propertyService;
