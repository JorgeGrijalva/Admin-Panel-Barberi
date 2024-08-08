import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  extrasList: {},
  chartData: [],
  error: '',
};

export const fetchExtrasList = createAsyncThunk(
  'report/fetchExtrasList',
  (params = {}) =>
    ReportService.getReportProductList(params).then((res) => res)
);

export const fetchExtrasChart = createAsyncThunk(
    'report/fetchExtrasChart',
    (params = {}) => ReportService.getOrderChart(params).then(res => res.data)
)

const extrasSlice = createSlice({
  name: 'extrasReport',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchExtrasList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExtrasList.fulfilled, (state, action) => {
      state.loading = false;
      state.extrasList = action.payload;
      state.error = '';
    });
    builder.addCase(fetchExtrasList.rejected, (state, action) => {
      state.loading = false;
      state.extrasList = {};
      state.error = action.error.message;
    });
    builder.addCase(fetchExtrasChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExtrasChart.fulfilled, (state, action) => {
      state.loading = false;
      state.chartData = action.payload;
      state.error = '';
    });
    builder.addCase(fetchExtrasChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });
  },
});

export default extrasSlice.reducer
