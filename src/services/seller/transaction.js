import request from '../request';

const transactionService = {
  getAll: (params) =>
    request.get('dashboard/seller/transactions/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/transactions/${id}`, { params }),
  create: (id, data) => request.post(`payments/order/${id}/transactions`, data),
  updateStatus: (id, params) =>
    request.put(`payments/order/${id}/transactions`, null, { params }),
  updateTransactionStatus: (id, data) =>
    request.post(`dashboard/seller/transactions/${id}`, data),
};

export default transactionService;
