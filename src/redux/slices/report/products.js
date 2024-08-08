import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  chartData: {},
  productList: [],
  error: '',
};

export const fetchReportProduct = createAsyncThunk(
  'report/fetchReportProduct',
  (params = {}) => {
    return ReportService.getReportProductList({
      ...params,
    }).then((res) => res);
  }
);
export const fetchReportProductChart = createAsyncThunk(
  'report/fetchReportProductChart',
  (params = {}) => {
    return ReportService.getReportProductChart({
      ...params,
    }).then((res) => res);
  }
);
export const ReportProductCompare = createAsyncThunk(
  'report/ReportProductCompare',
  (params = {}) => {
    return ReportService.productReportCompare({
      ...params,
    }).then((res) => res);
  }
);
const orderCountSlice = createSlice({
  name: 'productReport',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReportProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportProduct.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.productList = payload;
      state.error = '';
    });
    builder.addCase(fetchReportProduct.rejected, (state, action) => {
      state.loading = false;
      state.productList = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchReportProductChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportProductChart.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      if (!state.chartData.charts) {
        state.chartData = payload.data;
      }
      state.error = '';
    });
    builder.addCase(fetchReportProductChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });
    builder.addCase(ReportProductCompare.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(ReportProductCompare.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.chartData = payload.data;
      state.error = '';
    });
    builder.addCase(ReportProductCompare.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });
  },

  reducers: {
    filterReportProduct(state, action) {
      const { payload } = action;
    },
    productCompare(state, action) {
      const comparedProducts = state.productList.data?.data.filter((product) =>
        action.payload.some((id) => id === product.id)
      );
      return {
        ...state,
        chartData: { ...state.chartData, charts: comparedProducts },
      };
    },
    clearCompare(state, action) {
      return { ...state, chartData: { ...state.chartData, charts: undefined } };
    },
  },
});
export const { filterReportProduct, productCompare, clearCompare } =
  orderCountSlice.actions;
export default orderCountSlice.reducer;
