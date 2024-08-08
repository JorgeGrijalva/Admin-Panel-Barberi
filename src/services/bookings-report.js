import request from './request';

const url = 'dashboard/admin/booking/reports';

const bookingsReportService = {
  getAllStatisticsBookings: (params) =>
    request.get(`${url}/statistic`, { params }),
};

export default bookingsReportService;
