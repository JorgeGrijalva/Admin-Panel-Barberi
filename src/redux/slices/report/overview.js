import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  carts: {},
  products: {},
  categories: {},
  error: '',
};

export const fetchReportOverviewCart = createAsyncThunk(
  'report/fetchReportOverview',
  (params = {}) =>
    ReportService.getReportOverviewCarts(params).then((res) => res.data)
);

export const fetchReportOverviewProducts = createAsyncThunk(
  '/report/fetchReportOverviewProducts',
  (params = {}) =>
    ReportService.getReportOverviewProducts(params).then((res) => res)
);

export const fetchReportOverviewCategories = createAsyncThunk(
  'report/fetchReportOverviewCategories',
  (params = {}) =>
    ReportService.getReportOverviewCategories(params).then((res) => res)
);

const overviewSlice = createSlice({
  name: 'overviewReport',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReportOverviewCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportOverviewCart.fulfilled, (state, action) => {
      state.loading = false;
      state.carts = action.payload;
      state.error = '';
    });
    builder.addCase(fetchReportOverviewCart.rejected, (state, action) => {
      state.loading = false;
      state.carts = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchReportOverviewProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportOverviewProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload?.data;
      state.error = '';
    });
    builder.addCase(fetchReportOverviewProducts.rejected, (state, action) => {
      state.loading = false;
      state.carts = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchReportOverviewCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchReportOverviewCategories.fulfilled,
      (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data;
        state.error = '';
      }
    );
    builder.addCase(fetchReportOverviewCategories.rejected, (state, action) => {
      state.loading = false;
      state.carts = [];
      state.error = action.error.message;
    });
  },
});

export default overviewSlice.reducer;
