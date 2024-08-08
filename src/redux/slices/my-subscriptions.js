import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import paymentService from 'services/seller/payment';

const initialState = {
  loading: false,
  mySubscriptions: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchMySubscriptions = createAsyncThunk(
  'mySubscriptions/fetchMySubscriptions',
  (params = {}) =>
    paymentService.mySubscriptions({ ...initialState.params, ...params }),
);

const mySubscriptionsSlice = createSlice({
  name: 'mySubscriptions',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMySubscriptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMySubscriptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.mySubscriptions = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchMySubscriptions.rejected, (state, action) => {
      console.log('error');
      state.loading = false;
      state.mySubscriptions = [];
      state.error = action.error.message;
    });
  },
});

export default mySubscriptionsSlice.reducer;
