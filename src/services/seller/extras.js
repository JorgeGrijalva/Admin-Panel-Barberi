import request from '../request';

const extraService = {
  getAllGroups: (params) =>
    request.get('dashboard/seller/extra/groups', { params }),
  getGroupById: (id, params) =>
    request.get(`dashboard/seller/extra/groups/${id}`, { params }),
  getGroupTypes: (params) =>
    request.get('dashboard/seller/extra/groups/types', { params }),
  createGroup: (data) => request.post('dashboard/seller/extra/groups', data),
  updateGroup: (id, data) =>
    request.put(`dashboard/seller/extra/groups/${id}`, data),
  deleteGroup: (params) =>
    request.delete(`dashboard/seller/extra/groups/delete`, { params }),
  dropAllGroup: () => request.get(`dashboard/seller/extra/group/drop/all`),
  restoreAllGroup: () =>
    request.get(`dashboard/seller/extra/group/restore/all`),

  getAllValues: (params) =>
    request.get('dashboard/seller/extra/values', { params }),
  getValueById: (id, params) =>
    request.get(`dashboard/seller/extra/values/${id}`, { params }),
  createValue: (params) =>
    request.post('dashboard/seller/extra/values', {}, { params }),
  updateValue: (id, params) =>
    request.put(`dashboard/seller/extra/values/${id}`, {}, { params }),
  deleteValue: (params) =>
    request.delete(`dashboard/seller/extra/values/delete`, { params }),
  dropAllValue: () => request.get(`dashboard/seller/extra/values/drop/all`),
  restoreAllValue: () =>
    request.get(`dashboard/seller/extra/values/restore/all`),
};

export default extraService;
