import request from '../request';

const walletService = {
  getAll: (params) =>
    request.get('dashboard/user/wallet/histories', { params }),
  makeWithdraw: (data) => request.post(`dashboard/user/wallet/withdraw`, data),
  withdrawStatusChange: (uuid, data) =>
    request.post(`dashboard/user/wallet/history/${uuid}/status/change`, data),
  topUp: (paymentTag, data) =>
    request.post(`/dashboard/user/${paymentTag}-process`, data),
};

export default walletService;
