import request from './request';

const walletService = {
  getAll: (params) =>
    request.get('dashboard/admin/wallet/histories/paginate', { params }),
  statusChange: (uuid, data) =>
    request.post(`dashboard/admin/wallet/history/${uuid}/status/change`, data),
};

export default walletService;
