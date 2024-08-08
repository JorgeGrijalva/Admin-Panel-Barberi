import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deliveryService from '../../services/delivery';

const initialState = {
  loading: false,
  delivery: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchDelivery = createAsyncThunk(
  'delivery/fetchDelivery',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchDelivery.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDelivery.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.delivery = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchDelivery.rejected, (state, action) => {
      state.loading = false;
      state.delivery = [];
      state.error = action.error.message;
    });
  },
});

export default deliveriesSlice.reducer;
