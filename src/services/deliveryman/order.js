import request from '../request';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/deliveryman/orders/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/deliveryman/orders/${id}`, { params }),
  updateStatus: (id, data) =>
    request.post(
      `dashboard/deliveryman/order/details/${id}/status/update`,
      data
    ),
};

export default orderService;
