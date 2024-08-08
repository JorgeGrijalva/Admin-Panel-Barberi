import request from './request';

const masterWorkingDaysService = {
  getAll: () => request.get(`dashboard/admin/user-working-days`),
  getById: (id) => request(`dashboard/admin/user-working-days/${id}`),
  update: (id, data) =>
    request.put(`dashboard/admin/user-working-days/${id}`, data, {}),
};

export default masterWorkingDaysService;
