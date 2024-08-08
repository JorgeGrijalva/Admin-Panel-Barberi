import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user';
import sellerUserService from '../../services/seller/user';

const initialState = {
  loading: false,
  clients: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    role: 'user',
  },
  meta: {},
};

export const fetchClients = createAsyncThunk(
  'user/fetchClients',
  (params = {}) => {
    return userService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerClients = createAsyncThunk(
  'user/fetchSellerClients',
  (params = {}) => {
    return sellerUserService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchClients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.clients = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchClients.rejected, (state, action) => {
      state.loading = false;
      state.clients = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerClients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerClients.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.clients = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerClients.rejected, (state, action) => {
      state.loading = false;
      state.clients = [];
      state.error = action.error.message;
    });
  },
});

export default clientSlice.reducer;
