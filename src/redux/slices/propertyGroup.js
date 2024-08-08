import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/property';
import propertySellerService from '../../services/seller/property';

const initialState = {
  loading: false,
  propertyGroups: [],
  error: '',
  meta: {},
};

export const fetchPropertyGroups = createAsyncThunk(
  'property/fetchPropertyGroups',
  (params = {}) => {
    return propertyService
      .getAllGroups({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerPropertyGroups = createAsyncThunk(
  'property/fetchSellerExtraGroups',
  (params = {}) => {
    return propertySellerService
      .getAllGroups({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const propertyGroupSlice = createSlice({
  name: 'propertyGroup',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPropertyGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPropertyGroups.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.propertyGroups = payload.data;
      state.error = '';
      state.meta = payload.meta;
    });
    builder.addCase(fetchPropertyGroups.rejected, (state, action) => {
      state.loading = false;
      state.propertyGroups = [];
      state.error = action.error.message;
      state.meta = {};
    });

    builder.addCase(fetchSellerPropertyGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerPropertyGroups.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.propertyGroups = payload.data;
      state.error = '';
      state.meta = payload.meta;
    });
    builder.addCase(fetchSellerPropertyGroups.rejected, (state, action) => {
      state.loading = false;
      state.propertyGroups = [];
      state.error = action.error.message;
      state.meta = {};
    });
  },
});

export default propertyGroupSlice.reducer;
