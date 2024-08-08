import request from './request';

const userMembershipsService = {
  getAll: (params) =>
    request.get(`dashboard/admin/user-memberships`, { params }),
  getById: (id) => request.get(`dashboard/admin/user-memberships/${id}`),
};

export default userMembershipsService;
