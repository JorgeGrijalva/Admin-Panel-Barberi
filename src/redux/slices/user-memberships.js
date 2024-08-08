import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userMembershipsService from '../../services/user-memberships';
import sellerUserMembershipsService from '../../services/seller/user-memberships';

const initialState = {
  loading: false,
  userMemberships: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchUserMemberships = createAsyncThunk(
  'user-memberships/fetchUserMemberships',
  (params = {}) =>
    userMembershipsService.getAll({ ...initialState.params, ...params }),
);

export const fetchSellerUserMemberships = createAsyncThunk(
  'user-memberships/fetchSellerUserMemberships',
  (params = {}) =>
    sellerUserMembershipsService.getAll({ ...initialState.params, ...params }),
);

const userMemberships = createSlice({
  name: 'user-memberships',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUserMemberships.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserMemberships.fulfilled, (state, action) => {
      state.loading = false;
      const { payload } = action;
      state.userMemberships = payload.data;
      state.error = '';
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
    });
    builder.addCase(fetchUserMemberships.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.userMemberships = [];
    });

    builder.addCase(fetchSellerUserMemberships.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerUserMemberships.fulfilled, (state, action) => {
      state.loading = false;
      const { payload } = action;
      state.userMemberships = payload.data;
      state.error = '';
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
    });
    builder.addCase(fetchSellerUserMemberships.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.userMemberships = [];
    });
  },
});

export default userMemberships.reducer;
