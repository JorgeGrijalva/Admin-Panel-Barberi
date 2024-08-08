import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandService from '../../services/brand';
import sellerBrandService from '../../services/seller/brands';

const initialState = {
  loading: false,
  brands: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  (params = {}) => {
    return brandService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const sellerfetchBrands = createAsyncThunk(
  'brand/SellerfetchBrands',
  (params = {}) => {
    return sellerBrandService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBrands.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.brands = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBrands.rejected, (state, action) => {
      state.loading = false;
      state.brands = [];
      state.error = action.error.message;
    });

    // seller brand
    builder.addCase(sellerfetchBrands.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sellerfetchBrands.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.brands = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(sellerfetchBrands.rejected, (state, action) => {
      state.loading = false;
      state.brands = [];
      state.error = action.error.message;
    });
  },
});

export default brandSlice.reducer;
