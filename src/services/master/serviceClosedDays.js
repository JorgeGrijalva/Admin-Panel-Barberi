import request from '../request';

const closedDaysService = {
  getAll: (params) =>
    request.get('/dashboard/master/master-closed-dates', { params }),
  create: (params) =>
    request.post('/dashboard/master/master-closed-dates', null, { params }),
  delete: (params) =>
    request.delete('/dashboard/master/master-closed-dates/delete', { params }),
  update: (id, params) =>
    request.put(`/dashboard/master/master-closed-dates/${id}`, null, {
      params,
    }),
};

export default closedDaysService;
