import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statisticService from '../../../services/statistics';
import sellerStatisticService from '../../../services/seller/statistics';

const initialState = {
  loading: false,
  topCustomers: [],
  error: '',
  params: {
    time: 'subMonth',
    perPage: 5,
  },
};

export const fetchTopCustomers = createAsyncThunk(
  'statistics/fetchTopCustomers',
  (params = {}) => {
    return statisticService
      .topCustomers({ ...initialState.params, ...params })
      .then((res) => res);
  }
);
export const fetchSellerTopCustomers = createAsyncThunk(
  'statistics/fetchSellerTopCustomers',
  (params = {}) => {
    return sellerStatisticService
      .topCustomers({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const topCustomerSlice = createSlice({
  name: 'topCustomers',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTopCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopCustomers.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topCustomers = payload.data.data;
      state.error = '';
    });
    builder.addCase(fetchTopCustomers.rejected, (state, action) => {
      state.loading = false;
      state.topCustomers = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerTopCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerTopCustomers.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topCustomers = payload.data.data;
      state.error = '';
    });
    builder.addCase(fetchSellerTopCustomers.rejected, (state, action) => {
      state.loading = false;
      state.topCustomers = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    filterTopCustomers(state, action) {
      const { payload } = action;
      state.params = payload;
    },
  },
});
export const { filterTopCustomers } = topCustomerSlice.actions;
export default topCustomerSlice.reducer;
