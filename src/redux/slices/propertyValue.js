import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/property';
import sellerPropertyService from '../../services/seller/property';

const initialState = {
  loading: false,
  propertyValues: [],
  error: '',
};

export const fetchPropertyValues = createAsyncThunk(
  'property/fetchPropertyValues',
  (params = {}) => {
    return propertyService
      .getAllValues({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerPropertyValue = createAsyncThunk(
  'property/fetchSellerPropertyValue',
  (params = {}) => {
    return sellerPropertyService
      .getAllValues({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const propertyValueSlice = createSlice({
  name: 'propertyValue',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPropertyValues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPropertyValues.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.propertyValues = payload.data;
      state.error = '';
    });
    builder.addCase(fetchPropertyValues.rejected, (state, action) => {
      state.loading = false;
      state.propertyValues = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerPropertyValue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerPropertyValue.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.propertyValues = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerPropertyValue.rejected, (state, action) => {
      state.loading = false;
      state.propertyValues = [];
      state.error = action.error.message;
    });
  },
});

export default propertyValueSlice.reducer;
