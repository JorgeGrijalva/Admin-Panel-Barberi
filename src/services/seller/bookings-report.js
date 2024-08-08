import request from '../request';

const url = 'dashboard/seller/booking/reports';

const sellerBookingReportsServices = {
  getAllCardsBookings: (params) => request.get(`${url}/cards`, { params }),
  getAllPayments: (params) => request.get(`${url}/payments`, { params }),
  getAllMastersBookings: (params) => request.get(`${url}/masters`, { params }),
  getAllStatisticsBookings: (params) =>
    request.get(`${url}/statistic`, { params }),
  getAllSummaryBookings: (params) => request.get(`${url}/summary`, { params }),
};

export default sellerBookingReportsServices;
