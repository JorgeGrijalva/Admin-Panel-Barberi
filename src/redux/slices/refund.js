import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import refundService from '../../services/refund';
import sellerRefundService from '../../services/seller/refund';

const initialState = {
  loading: false,
  refund: [],
  refundDate: null,
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchRefund = createAsyncThunk(
  'refund/fetchRefund',
  (params = {}) => {
    return refundService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const sellerfetchRefund = createAsyncThunk(
  'refund/sellerfetchRefund',
  (params = {}) => {
    return sellerRefundService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const refund = createSlice({
  name: 'review',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRefund.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRefund.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.refund = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchRefund.rejected, (state, action) => {
      state.loading = false;
      state.refund = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(sellerfetchRefund.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sellerfetchRefund.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.refund = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(sellerfetchRefund.rejected, (state, action) => {
      state.loading = false;
      state.refund = [];
      state.error = action.error.message;
    });
  },
});

export default refund.reducer;
