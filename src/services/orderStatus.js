import request from './request';

const OrderStatusService = {
  getAll: (params) => request.get('dashboard/admin/order-statuses', { params }),
  get: (params) => request.get('rest/order-statuses', { params }),
  status: (id) => request.post(`dashboard/admin/order-statuses/${id}/active`),
};

export default OrderStatusService;
