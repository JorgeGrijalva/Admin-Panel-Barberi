import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../../services/wallet';

const initialState = {
  loading: false,
  payoutRequests: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'withdraw',
  },
  meta: {},
};

export const fetchPayoutRequests = createAsyncThunk(
  'payout/fetchPayoutRequests',
  (params = {}) => {
    return walletService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const payoutSlice = createSlice({
  name: 'payoutRequests',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPayoutRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPayoutRequests.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.payoutRequests = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchPayoutRequests.rejected, (state, action) => {
      state.loading = false;
      state.payoutRequests = [];
      state.error = action.error.message;
    });
  },
});

export default payoutSlice.reducer;
