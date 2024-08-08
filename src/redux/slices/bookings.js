import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from 'services/booking';
import sellerBookingService from 'services/seller/booking';

const initialState = {
  loading: false,
  bookings: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
  seller: {
    loading: false,
    bookings: [],
    error: '',
    params: {
      page: 1,
      perPage: 10,
    },
    meta: {},
  },
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  (params = {}) =>
    bookingService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res),
);

export const fetchSellerBookings = createAsyncThunk(
  'booking/fetchSellerBookings',
  (params = {}) =>
    sellerBookingService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res),
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  extraReducers: (builder) => {
    // admin
    builder.addCase(fetchBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bookings = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.loading = false;
      state.bookings = [];
      state.error = action.error.message;
    });
    // seller
    builder.addCase(fetchSellerBookings.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(fetchSellerBookings.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.loading = false;
      state.seller.bookings = payload.data;
      state.seller.meta = payload.meta;
      state.seller.params.page = payload.meta.current_page;
      state.seller.params.perPage = payload.meta.per_page;
      state.seller.error = '';
    });
    builder.addCase(fetchSellerBookings.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.bookings = [];
      state.seller.error = action.error.message;
    });
  },
});

export default bookingSlice.reducer;
