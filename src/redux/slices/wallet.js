import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user';
import walletService from '../../services/seller/wallet';

const initialState = {
  loading: false,
  wallets: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchWallets = createAsyncThunk(
  'wallet/fetchWallets',
  (params = {}) => {
    return userService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);
export const fetchSellerWallets = createAsyncThunk(
  'wallet/fetchSellerWallets',
  (params = {}) => {
    return walletService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchWallets.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWallets.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.wallets = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchWallets.rejected, (state, action) => {
      state.loading = false;
      state.wallets = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerWallets.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerWallets.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.wallets = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerWallets.rejected, (state, action) => {
      state.loading = false;
      state.wallets = [];
      state.error = action.error.message;
    });
  },
});

export default walletSlice.reducer;
