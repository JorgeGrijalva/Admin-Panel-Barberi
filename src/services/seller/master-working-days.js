import request from '../request';

const masterWorkingDaysService = {
  getAll: () => request.get(`dashboard/seller/user-working-days`),
  getById: (id) => request(`dashboard/seller/user-working-days/${id}`),
  update: (id, data) =>
    request.put(`dashboard/seller/user-working-days/${id}`, data, {}),
};

export default masterWorkingDaysService;
