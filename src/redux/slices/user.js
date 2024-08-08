import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user';
import sellerUserService from '../../services/seller/user';

const initialState = {
  loading: false,
  users: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    role: 'user',
  },
  meta: {},
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', (params = {}) => {
  return userService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

export const fetchSellerUsers = createAsyncThunk(
  'user/fetchSellerUsers',
  (params = {}) => {
    return sellerUserService
      .shopUsers({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.users = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerUsers.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.users = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerUsers.rejected, (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
