import request from '../request';

const workingDays = {
  getAll: () => request.get(`dashboard/master/user-working-days`),
  create: (data) =>
    request.post(`dashboard/master/user-working-days`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/master/user-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/master/user-working-days`, { params }),
};

export default workingDays;
