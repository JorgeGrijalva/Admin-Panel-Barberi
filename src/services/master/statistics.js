import request from '../request';

const masterStatisticsServices = {
  getAllReportStatistics: (params = {}) =>
    request.get('dashboard/master/booking/reports/statistic', { params }),
};

export default masterStatisticsServices;
