import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  chartData: [],
  productList: [],
  error: '',
};

export const fetchReportProductChart = createAsyncThunk(
  'categoryReport/fetchReportProductChart',
  (params = {}) => {
    return ReportService.getCategoriesChart({
      ...params,
    }).then((res) => res);
  }
);
const orderCountSlice = createSlice({
  name: 'categoryReport',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReportProductChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportProductChart.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.chartData = payload?.data;
      state.productList = payload?.data?.paginate;
      state.error = '';
    });
    builder.addCase(fetchReportProductChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.productList = [];
      state.error = action.error.message;
    });
  },

  reducers: {
    filterReportProduct(state, action) {
      const { payload } = action;
    },
  },
});
export const { filterReportProduct } = orderCountSlice.actions;
export default orderCountSlice.reducer;
