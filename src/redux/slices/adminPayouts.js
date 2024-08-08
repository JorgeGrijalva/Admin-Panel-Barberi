import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { payoutService } from '../../services/payout';

const initialState = {
  loading: false,
  payoutRequests: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchAdminPayouts = createAsyncThunk(
  'payout/fetchAdminPayouts',
  (params = {}) => {
    return payoutService 
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const payoutSlice = createSlice({
  name: 'payoutRequests',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAdminPayouts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminPayouts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.payoutRequests = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchAdminPayouts.rejected, (state, action) => {
      state.loading = false;
      state.payoutRequests = [];
      state.error = action.error.message;
    });
  },
});

export default payoutSlice.reducer;
