import request from './request';
const paymentToPartnerService = {
  getAll: (params) =>
    request.get('dashboard/admin/payment-to-partners', { params }),
  getAllTransactions: (params, name = 'orders') =>
    request.get(`dashboard/admin/${name}/report/transactions`, { params }),
  pay: (data) =>
    request.post('dashboard/admin/payment-to-partners/store/many', data),
};

export default paymentToPartnerService;
