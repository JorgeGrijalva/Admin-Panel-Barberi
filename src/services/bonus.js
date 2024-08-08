import request from './request';

const bonnusService = {
  getAll: (params) => request.get('dashboard/admin/bonuses', { params }),
};

export default bonnusService;
