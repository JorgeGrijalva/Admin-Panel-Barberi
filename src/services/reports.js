import request from './request';

const ReportService = {
  getReportProductChart: (params) =>
    request.get('dashboard/admin/products/report/chart', { params }),
  getReportProductList: (params) =>
    request.get('dashboard/admin/products/report/paginate', { params }),
  productReportCompare: (params) =>
    request.get('dashboard/admin/products/report/compare', { params }),
  getOrderChart: (params) =>
    request.get('dashboard/admin/orders/report/chart', { params }),
  getOrderProducts: (params) =>
    request.get('dashboard/admin/orders/report/paginate', { params }),
  getStocks: (params) =>
    request.get('dashboard/admin/stocks/report/paginate', { params }),
  getCategoriesProducts: (params) =>
    request.get('dashboard/admin/categories/report/paginate', { params }),
  getCategoriesChart: (params) =>
    request.get('dashboard/admin/categories/report/chart', { params }),
  getExtrasReport: (id, params) =>
    request.get(`dashboard/admin/product/${id}/report/extras`, { params }),
  getRevenueReport: (params) =>
    request.get('dashboard/admin/revenue/report', { params }),
  getRevenueChart: (params) =>
    request.get('dashboard/admin/revenue/report/chart', { params }),
  getReportOverviewCarts: (params) =>
    request.get('dashboard/admin/overview/carts', { params }),
  getReportOverviewProducts: (params) =>
    request.get('dashboard/admin/overview/products', { params }),
  getReportOverviewCategories: (params) =>
    request.get('dashboard/admin/overview/categories', { params }),
  getReportExtrasList: (params) =>
    request.get('dashboard/admin/extras/report/paginate', { params }),
};

export default ReportService;
