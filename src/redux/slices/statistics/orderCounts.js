import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statisticService from '../../../services/statistics';
import sellerStatisticService from '../../../services/seller/statistics';

const initialState = {
  loading: false,
  counts: [],
  error: '',
  params: {
    time: 'subMonth',
  },
};

export const fetchOrderCounts = createAsyncThunk(
  'statistics/fetchOrderCounts',
  (params = {}) => {
    return statisticService
      .ordersCount({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerOrderCounts = createAsyncThunk(
  'statistics/fetchSellerOrderCounts',
  (params = {}) => {
    return sellerStatisticService
      .ordersCount({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const orderCountSlice = createSlice({
  name: 'orderCount',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrderCounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderCounts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.counts = payload.data;
      state.error = '';
    });
    builder.addCase(fetchOrderCounts.rejected, (state, action) => {
      state.loading = false;
      state.counts = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerOrderCounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerOrderCounts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.counts = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerOrderCounts.rejected, (state, action) => {
      state.loading = false;
      state.counts = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    filterOrderCounts(state, action) {
      const { payload } = action;
      state.params = payload;
    },
  },
});
export const { filterOrderCounts } = orderCountSlice.actions;
export default orderCountSlice.reducer;
