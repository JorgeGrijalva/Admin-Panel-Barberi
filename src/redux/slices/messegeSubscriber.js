import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageSubscriberService from '../../services/messageSubscriber';

const initialState = {
  loading: false,
  subscribers: [],
  error: '',
};

export const fetchMessageSubscriber = createAsyncThunk(
  'subscriber/fetchSubscribers',
  (params = {}) => {
    return messageSubscriberService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMessageSubscriber.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMessageSubscriber.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.subscribers = payload?.data;
      state.error = '';
    });
    builder.addCase(fetchMessageSubscriber.rejected, (state, action) => {
      state.loading = false;
      state.subscribers = {};
      state.error = action.error.message;
    });
  },
});

export default subscriberSlice.reducer;
