import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseService from 'services/warehouse';

const initialState = {
  loading: false,
  warehouses: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchWarehouses = createAsyncThunk(
  'warehouse/fetchWarehouses',
  (params = {}) => {
    return warehouseService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const warehouses = createSlice({
  name: 'warehouse',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchWarehouses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWarehouses.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.warehouses = payload.data;
      state.meta = payload.meta;
      state.error = '';
    });
    builder.addCase(fetchWarehouses.rejected, (state, action) => {
      state.loading = false;
      state.warehouses = [];
      state.error = action.error.message;
    });
  },
});

export default warehouses.reducer;
