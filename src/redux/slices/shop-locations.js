import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopLocationsService from '../../services/shop-locations';
import sellerShopLocationService from 'services/seller/shop-locations';

const initialState = {
  loading: false,
  locations: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchShopLocations = createAsyncThunk(
  'shop/fetchShopLocations',
  (params = {}) => {
    return shopLocationsService
      .getAll({
        ...initialState.params,
        ...params,
      })
      .then((res) => res);
  }
);

export const fetchSellerShopLocations = createAsyncThunk(
  'shop/fetchSellerShopLocations',
  (params = {}) => {
    return sellerShopLocationService
      .getAll({
        ...initialState.params,
        ...params,
      })
      .then((res) => res);
  }
);
const shopLocationsSlice = createSlice({
  name: 'shopLocations',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShopLocations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopLocations.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.locations = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchShopLocations.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerShopLocations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerShopLocations.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.locations = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerShopLocations.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });
  },
});

export default shopLocationsSlice.reducer;
