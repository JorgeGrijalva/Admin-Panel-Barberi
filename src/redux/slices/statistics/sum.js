import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statisticService from '../../../services/statistics';
import sellerStatisticService from '../../../services/seller/statistics';

const initialState = {
  loading: false,
  sum: {},
  error: '',
};

export const fetchStatisticsSum = createAsyncThunk(
  'statistics/fetchStatisticsSum',
  (params = {}) => {
    return statisticService.getAllSum(params).then((res) => res);
  }
);
export const fetchSellerStatisticsSum = createAsyncThunk(
  'statistics/fetchSellerStatisticsSum',
  (params = {}) => {
    return sellerStatisticService.getAllSum(params).then((res) => res);
  }
);

const statisticsSumSlice = createSlice({
  name: 'statisticsSum',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchStatisticsSum.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStatisticsSum.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sum = payload.data[0];
      state.error = '';
    });
    builder.addCase(fetchStatisticsSum.rejected, (state, action) => {
      state.loading = false;
      state.sum = {};
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerStatisticsSum.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerStatisticsSum.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sum = payload.data[0];
      state.error = '';
    });
    builder.addCase(fetchSellerStatisticsSum.rejected, (state, action) => {
      state.loading = false;
      state.sum = {};
      state.error = action.error.message;
    });
  },
});

export default statisticsSumSlice.reducer;
