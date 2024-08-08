import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import requestAdminModelsService from 'services/request-models';

const initialState = {
  loading: false,
  deliverymanRequestData: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'user',
  },
  meta: {},
};

export const fetchDeliverymanRequest = createAsyncThunk(
  'deliverymanRequest/fetchDeliverymanRequest',
  (params = {}) => {
    return requestAdminModelsService.getAll({
      ...initialState.params,
      ...params,
    });
  },
);

const deliverymanRequestSlice = createSlice({
  name: 'deliverymanRequest',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchDeliverymanRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeliverymanRequest.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.deliverymanRequestData = payload.data;
      state.meta = payload.meta;
    });
    builder.addCase(fetchDeliverymanRequest.rejected, (state, action) => {
      state.loading = false;
      state.deliverymanRequestData = [];
      state.error = action.error.message;
    });
  },
});

export default deliverymanRequestSlice.reducer;
