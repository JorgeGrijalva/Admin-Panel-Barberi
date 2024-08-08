import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopBonusService from '../../services/seller/shopBonus';

const initialState = {
  loading: false,
  shopBonus: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'shop',
  },
  meta: {},
};

export const fetchShopBonus = createAsyncThunk(
  'bonus/fetchShopBonus',
  (params = {}) => {
    return shopBonusService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const shopBonus = createSlice({
  name: 'shopBonus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShopBonus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopBonus.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shopBonus = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchShopBonus.rejected, (state, action) => {
      state.loading = false;
      state.shopBonus = [];
      state.error = action.error.message;
    });
  },
});

export default shopBonus.reducer;
