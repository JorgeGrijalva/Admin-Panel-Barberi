import request from './request';

const settingService = {
  get: (params) => request.get('dashboard/admin/settings', { params }),
  update: (data) => request.post(`dashboard/admin/settings`, data, {}),
};

export default settingService;
