import request from '../request';

const paymentService = {
  getAll: (params) => request.get('rest/payments', { params }),
  getById: (id) => request.get(`rest/shop-payments/${id}`),
};

export default paymentService;
