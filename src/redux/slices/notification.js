import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../../services/blog';

const initialState = {
  loading: false,
  notifications: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'notification',
  },
  meta: {},
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  (params = {}) => {
    return blogService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.notifications = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.notifications = [];
      state.error = action.error.message;
    });
  },
});

export default notificationSlice.reducer;
