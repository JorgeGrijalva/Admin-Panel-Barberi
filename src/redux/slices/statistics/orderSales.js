import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statisticService from '../../../services/statistics';
import sellerStatisticService from '../../../services/seller/statistics';

const initialState = {
  loading: false,
  sales: [],
  error: '',
  params: {
    time: 'subMonth',
  },
};

export const fetchOrderSales = createAsyncThunk(
  'statistics/fetchOrderSales',
  (params = {}) => {
    return statisticService
      .ordersCount({ ...initialState.params, ...params })
      .then((res) => res);
  }
);
export const fetchSellerOrderSales = createAsyncThunk(
  'statistics/fetchSellerOrderSales',
  (params = {}) => {
    return sellerStatisticService
      .ordersCount({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const orderSalesSlice = createSlice({
  name: 'orderSales',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrderSales.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderSales.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sales = payload.data;
      state.error = '';
    });
    builder.addCase(fetchOrderSales.rejected, (state, action) => {
      state.loading = false;
      state.sales = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerOrderSales.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerOrderSales.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sales = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerOrderSales.rejected, (state, action) => {
      state.loading = false;
      state.sales = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    filterOrderSales(state, action) {
      const { payload } = action;
      state.params = payload;
    },
  },
});
export const { filterOrderSales } = orderSalesSlice.actions;
export default orderSalesSlice.reducer;
