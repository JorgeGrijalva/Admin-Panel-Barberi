import request from '../request';

const statisticService = {
  getAll: (params) => request.get('dashboard/seller/statistics', { params }),
  topCustomers: (params) =>
    request.get(`dashboard/seller/statistics/users`, { params }),
  topProducts: (params) =>
    request.get(`dashboard/seller/statistics/products`, { params }),
  ordersCount: (params) =>
    request.get(`dashboard/seller/statistics/orders/chart`, { params }),
};

export default statisticService;
