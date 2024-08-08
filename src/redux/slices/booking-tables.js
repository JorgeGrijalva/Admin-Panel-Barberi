import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingTable from '../../services/seller/booking-table';

const initialState = {
  loading: false,
  tables: [],
  statistics: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBookingTable = createAsyncThunk(
  'booking/fetchBookingTable',
  (params = {}) => {
    return sellerBookingTable
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bookingTableSlice = createSlice({
  name: 'bookingTable',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBookingTable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingTable.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.tables = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchBookingTable.rejected, (state, action) => {
      state.loading = false;
      state.tables = [];
      state.error = action.error.message;
    });
  },
});

export default bookingTableSlice.reducer;
