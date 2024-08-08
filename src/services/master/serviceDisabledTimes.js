import request from '../request';
import qs from 'qs';

const disabledTimes = {
  create: (params) =>
    request.post(`dashboard/master/master-disabled-times`, null, {
      params,
      paramsSerializer: (params) => qs.stringify(params),
    }),
  getAll: (params) =>
    request.get(`dashboard/master/master-disabled-times`, { params }),
  getById: (id) => request.get(`dashboard/master/master-disabled-times/${id}`),
  // update: (id, data) =>
  //     request.put(`dashboard/master/user-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/master/master-disabled-times/delete`, { params }),
  update: (id, params) =>
    request.put(`dashboard/master/master-disabled-times/${id}`, null, {
      params,
      paramsSerializer: (params) => qs.stringify(params),
    }),
};

export default disabledTimes;
