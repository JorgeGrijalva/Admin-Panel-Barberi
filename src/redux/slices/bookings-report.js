import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingReportsServices from 'services/seller/bookings-report';
import bookingsReportService from 'services/bookings-report';
import masterStatisticsService from 'services/master/statistics';

const initialState = {
  loading: false,
  chartData: [],
  paymentsData: [],
  mastersData: { data: [], meta: {} },
  statisticsData: {},
  error: '',
  seller: {
    loading: false,
    cardData: [],
    chartData: [],
    paymentsData: [],
    mastersData: { data: [], meta: {}, loading: false },
    statisticsData: {},
    summaryData: [],
    error: '',
  },
  master: {
    loading: false,
    cardData: [],
    chartData: [],
    paymentsData: [],
    mastersData: { data: [], meta: {}, loading: false },
    statisticsData: {},
    summaryData: [],
    error: '',
  },
};

// admin
export const fetchStatisticsBookingsReportAdmin = createAsyncThunk(
  'bookingsReport/fetchStatisticsBookingsReportAdmin',
  (params = {}) => bookingsReportService.getAllStatisticsBookings(params)
);

// master
export const fetchStatisticsBookingsReportMaster = createAsyncThunk(
  'bookingsReport/fetchStatisticsBookingsReportMaster',
  (params = {}) => masterStatisticsService.getAllReportStatistics(params)
);

// seller
export const fetchPaymentsReport = createAsyncThunk(
  'bookingsReport/fetchPaymentsReport',
  (params = {}) =>
    sellerBookingReportsServices.getAllPayments(params).then((res) => res)
);

export const fetchMastersBookingsReport = createAsyncThunk(
  'bookingsReport/fetchMastersBookingsReport',
  (params = {}) =>
    sellerBookingReportsServices
      .getAllMastersBookings(params)
      .then((res) => res)
);

export const fetchCardsBookingsReport = createAsyncThunk(
  'bookingsReport/fetchCardsBookingsReport',
  (params = {}) => sellerBookingReportsServices.getAllCardsBookings(params)
);

export const fetchStatisticsBookingsReport = createAsyncThunk(
  'bookingsReport/fetchStatisticsBookingsReport',
  (params = {}) => sellerBookingReportsServices.getAllStatisticsBookings(params)
);

export const fetchSummaryBookingsReport = createAsyncThunk(
  'bookingsReport/fetchSummaryBookingsReport',
  (params = {}) => sellerBookingReportsServices.getAllSummaryBookings(params)
);

const bookingsReportSlice = createSlice({
  name: 'bookingsReport',
  initialState,
  extraReducers: (builder) => {
    // admin //////////////////////////////////////////////////////////////
    builder.addCase(fetchStatisticsBookingsReportAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchStatisticsBookingsReportAdmin.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.statisticsData = payload;
        state.error = '';
      }
    );
    builder.addCase(
      fetchStatisticsBookingsReportAdmin.rejected,
      (state, action) => {
        state.loading = false;
        state.statisticsData = {};
        state.error = action.error.message;
      }
    );
    // master //////////////////////////////////////////////////////////////
    builder.addCase(fetchStatisticsBookingsReportMaster.pending, (state) => {
      state.master.loading = true;
    });
    builder.addCase(
      fetchStatisticsBookingsReportMaster.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.master.loading = false;
        state.master.statisticsData = payload;
        state.master.error = '';
      }
    );
    builder.addCase(
      fetchStatisticsBookingsReportMaster.rejected,
      (state, action) => {
        state.master.loading = false;
        state.master.statisticsData = {};
        state.master.error = action.error.message;
      }
    );
    // seller //////////////////////////////////////////////////////////////
    //payments
    builder.addCase(fetchPaymentsReport.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(fetchPaymentsReport.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.loading = false;
      state.seller.paymentsData = payload;
      state.seller.error = '';
    });
    builder.addCase(fetchPaymentsReport.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.paymentsData = [];
      state.seller.error = action.error.message;
    });
    //masters
    builder.addCase(fetchMastersBookingsReport.pending, (state) => {
      state.seller.mastersData.loading = true;
    });
    builder.addCase(fetchMastersBookingsReport.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.mastersData.loading = false;
      state.seller.mastersData.data = payload.data;
      state.seller.mastersData.meta = payload.meta;
      state.seller.error = '';
    });
    builder.addCase(fetchMastersBookingsReport.rejected, (state, action) => {
      state.seller.mastersData.loading = false;
      state.seller.mastersData.data = initialState.seller.mastersData.data;
      state.seller.mastersData.meta = initialState.seller.mastersData.meta;
      state.seller.error = action.error.message;
    });
    //cards
    builder.addCase(fetchCardsBookingsReport.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(fetchCardsBookingsReport.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.loading = false;
      state.seller.cardData = payload;
      state.seller.error = '';
    });
    builder.addCase(fetchCardsBookingsReport.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.cardData = [];
      state.seller.error = action.error.message;
    });
    //statistics
    builder.addCase(fetchStatisticsBookingsReport.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(
      fetchStatisticsBookingsReport.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.seller.loading = false;
        state.seller.statisticsData = payload;
        state.seller.error = '';
      }
    );
    builder.addCase(fetchStatisticsBookingsReport.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.statisticsData = {};
      state.seller.error = action.error.message;
    });
    //summary
    builder.addCase(fetchSummaryBookingsReport.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(fetchSummaryBookingsReport.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.loading = false;
      state.seller.summaryData = payload;
      state.seller.error = '';
    });
    builder.addCase(fetchSummaryBookingsReport.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.summaryData = [];
      state.seller.error = action.error.message;
    });
  },
});

export default bookingsReportSlice.reducer;
