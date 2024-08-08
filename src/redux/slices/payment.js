import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/payment';
import restPaymentService from '../../services/rest/payment';
import paymentSellerService from '../../services/seller/payment';

const initialState = {
  loading: false,
  payments: [],
  error: '',
};

export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  (params = {}) => {
    return paymentService.getAll(params).then((res) => res);
  }
);

export const fetchRestPayments = createAsyncThunk(
  'payment/fetchRestPayments',
  (params = {}) => {
    return restPaymentService.getAll(params).then((res) => res);
  }
);

export const fetchSellerPayments = createAsyncThunk(
  'payment/fetchSellerPayments',
  (params = {}) => {
    return paymentSellerService.getAll(params).then((res) => res);
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPayments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.payments = payload.data;
      state.error = '';
    });
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.loading = false;
      state.payments = [];
      state.error = action.error.message;
    });

    // rest Payment Service
    builder.addCase(fetchRestPayments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRestPayments.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.payments = payload.data;
      state.error = '';
    });
    builder.addCase(fetchRestPayments.rejected, (state, action) => {
      state.loading = false;
      state.payments = [];
      state.error = action.error.message;
    });

    //seller
    builder.addCase(fetchSellerPayments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerPayments.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.payments = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerPayments.rejected, (state, action) => {
      state.loading = false;
      state.payments = [];
      state.error = action.error.message;
    });
  },
});

export default paymentSlice.reducer;
