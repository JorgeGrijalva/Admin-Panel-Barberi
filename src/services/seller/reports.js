import request from '../request';

const ReportService = {
  getOrderChart: (params) =>
    request.get('dashboard/seller/orders/report/chart', { params }),
  getOrderProducts: (params) =>
    request.get('dashboard/seller/orders/report/paginate', { params }),
};

export default ReportService;
