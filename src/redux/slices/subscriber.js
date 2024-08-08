import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriberService from '../../services/subscriber';

const initialState = {
  loading: false,
  subscriber: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchSubscriber = createAsyncThunk(
  'subscriber/fetchSubscriber',
  (params = {}) => {
    return subscriberService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const subscriberSlice = createSlice({
  name: 'storeis',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriber.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSubscriber.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.subscriber = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSubscriber.rejected, (state, action) => {
      state.loading = false;
      state.subscriber = [];
      state.error = action.error.message;
    });
  },
});

export default subscriberSlice.reducer;
