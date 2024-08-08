import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import servicesService from 'services/services';
import sellerServicesService from 'services/seller/services';
import masterServicesService from 'services/master/services';

const initialState = {
  loading: false,
  services: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  (params = {}) => {
    return servicesService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerServices = createAsyncThunk(
  'services/fetchSellerServices',
  (params = {}) => {
    return sellerServicesService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  extraReducers: (builder) => {
    // admin
    builder.addCase(fetchServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      const { payload } = action;
      const { data, meta } = payload || {};

      state.loading = false;
      state.services = data || [];
      state.meta = meta || {};
      state.params = {
        page: meta?.current_page || state.params.page,
        perPage: meta?.per_page || state.params.perPage,
      };
      state.error = '';
    });
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.loading = false;
      state.services = [];
      state.error = action?.error?.message;
    });
    // seller
    builder.addCase(fetchSellerServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerServices.fulfilled, (state, action) => {
      const { payload } = action;
      const { data, meta } = payload || {};

      state.loading = false;
      state.services = data || [];
      state.meta = meta || {};
      state.params = {
        page: meta?.current_page || state.params.page,
        perPage: meta?.per_page || state.params.perPage,
      };
      state.error = '';
    });
    builder.addCase(fetchSellerServices.rejected, (state, action) => {
      state.loading = false;
      state.services = [];
      state.error = action?.error?.message;
    });
  },
  reducers: {
    clearServicesState: (state) => {
      state.loading = false;
      state.error = initialState.error;
      state.params = initialState.params;
      state.services = initialState.services;
      state.meta = initialState.meta;
    },
  },
});

export const { clearServicesState } = servicesSlice.actions;

export default servicesSlice.reducer;
