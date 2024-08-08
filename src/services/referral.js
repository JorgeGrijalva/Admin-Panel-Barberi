import request from './request';

const referralService = {
  get: (params) => request.get('dashboard/admin/referrals', { params }),
  update: (params) => request.post(`dashboard/admin/referrals`, {}, { params }),
};

export default referralService;
