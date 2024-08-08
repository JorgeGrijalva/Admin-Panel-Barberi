import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { paymentPayloadService } from '../../services/paymentPayload';

const initialState = {
  payloads: [],
  loading: false,
  error: '',
  meta: {}
};

export const fetchPaymentPayloads = createAsyncThunk(
  'payment/payloads',
  (params = {}) => paymentPayloadService.getAll(params).then((res) => res)
);

const paymentPayloadSlice = createSlice({
  name: 'paymentPayload',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentPayloads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPaymentPayloads.fulfilled, (state, action) => {
      state.loading = false;
      state.payloads = action.payload.data;
      state.meta = action.payload.meta;
      state.error = '';
    });
    builder.addCase(fetchPaymentPayloads.rejected, (state, action) => {
      state.loading = false;
      state.payloads = [];
      state.meta = {};
      state.error = action.error.message;
    });
  },
});

export default paymentPayloadSlice.reducer;