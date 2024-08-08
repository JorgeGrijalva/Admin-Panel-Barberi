import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  revenueList: [],
  chartData: [],
  error: '',
};

export const fetchReportRevenue = createAsyncThunk(
  'report/fetchReportRevenue',
  (params = {}) =>
    ReportService.getRevenueReport(params).then((res) => res.data)
);

export const fetchReportRevenueChart = createAsyncThunk(
  'report/fetchReportRevenueChart',
  (params = {}) => ReportService.getOrderChart(params).then((res) => res.data)
);

const revenueReportSlice = createSlice({
  name: 'revenueReport',

  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReportRevenue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportRevenue.fulfilled, (state, action) => {
      state.loading = false;
      state.revenueList = action.payload;
      state.error = '';
    });
    builder.addCase(fetchReportRevenue.rejected, (state, action) => {
      state.loading = false;
      state.revenueList = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchReportRevenueChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportRevenueChart.fulfilled, (state, action) => {
      state.loading = false;
      state.chartData = action.payload;
      state.error = '';
    });
    builder.addCase(fetchReportRevenueChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });
  },
});

export default revenueReportSlice.reducer;
