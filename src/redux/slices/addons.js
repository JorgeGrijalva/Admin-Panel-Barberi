import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/product';
import sellerProductService from '../../services/seller/product';

const initialState = {
  loading: false,
  addonsList: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    addon: 1,
  },
  meta: {},
};

export const fetchAddons = createAsyncThunk(
  'product/fetchAddons',
  (params = {}) => {
    return productService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerfetchAddons = createAsyncThunk(
  'product/fetchSellerfetchAddons',
  (params = {}) => {
    return sellerProductService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const addonsSlice = createSlice({
  name: 'product',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAddons.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAddons.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.addonsList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchAddons.rejected, (state, action) => {
      state.loading = false;
      state.addonsList = [];
      state.error = action.error.message;
    });

    //rest products
    builder.addCase(fetchSellerfetchAddons.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerfetchAddons.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.addonsList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerfetchAddons.rejected, (state, action) => {
      state.loading = false;
      state.addonsList = [];
      state.error = action.error.message;
    });
  },
});

export default addonsSlice.reducer;
