import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopAdsService from 'services/shop-ads';

const initialState = {
  loading: false,
  shopAdsList: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchShopAds = createAsyncThunk(
  'shop-ads/fetchShopAds',
  (params = {}) => {
    return shopAdsService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const shopAdsSlice = createSlice({
  name: 'shopAds',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShopAds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopAds.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shopAdsList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.perPage;
      state.error = '';
    });
    builder.addCase(fetchShopAds.rejected, (state, action) => {
      state.loading = false;
      state.shopAdsList = [];
      state.error = action.error.message;
    });
  },
});

export default shopAdsSlice.reducer;
