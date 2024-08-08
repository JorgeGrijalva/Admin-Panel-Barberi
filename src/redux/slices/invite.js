import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inviteService from '../../services/seller/invites';

const initialState = {
  loading: false,
  invites: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchInvites = createAsyncThunk(
  'invite/fetchInvites',
  (params = {}) => {
    return inviteService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const inviteSlice = createSlice({
  name: 'invite',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchInvites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchInvites.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.invites = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchInvites.rejected, (state, action) => {
      state.loading = false;
      state.invites = [];
      state.error = action.error.message;
    });
  },
});

export default inviteSlice.reducer;
