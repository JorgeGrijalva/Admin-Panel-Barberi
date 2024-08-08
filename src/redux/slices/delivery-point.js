import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deliveryPointService from 'services/delivery-point';

const initialState = {
  loading: false,
  deliveryPoints: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchDeliveryPoint = createAsyncThunk(
  'point/fetchDeliveryPoint',
  (params = {}) => {
    return deliveryPointService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const deliveryPoints = createSlice({
  name: 'deliveryPoint',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchDeliveryPoint.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeliveryPoint.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.deliveryPoints = payload.data;
      state.meta = payload.meta;
      state.error = '';
    });
    builder.addCase(fetchDeliveryPoint.rejected, (state, action) => {
      state.loading = false;
      state.deliveryPoints = [];
      state.error = action.error.message;
    });
  },
});

export default deliveryPoints.reducer;
