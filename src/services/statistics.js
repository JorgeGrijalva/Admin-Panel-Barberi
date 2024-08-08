import request from './request';

const statisticService = {
  getAll: (params) => request.get('dashboard/admin/statistics', { params }),
  topCustomers: (params) =>
    request.get(`dashboard/admin/statistics/users`, { params }),
  topProducts: (params) =>
    request.get(`dashboard/admin/statistics/products`, { params }),
  orderSales: (params) =>
    request.get(`dashboard/admin/statistics/sellers/chart`, { params }),
  ordersCount: (params) =>
    request.get(`dashboard/admin/statistics/orders/chart`, { params }),
};

export default statisticService;
