import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerBookingTable from '../../services/seller/booking-time';

const initialState = {
  loading: false,
  data: null,
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
};

export const fetchBookingTime = createAsyncThunk(
  'booking/fetchBookingTime',
  (params = {}) => {
    return sellerBookingTable
      .getAll({ ...initialState.params })
      .then((res) => res);
  }
);

const bookingTimeSlice = createSlice({
  name: 'bookingTime',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBookingTime.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingTime.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data ? [payload.data] : [];
      state.error = '';
    });
    builder.addCase(fetchBookingTime.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default bookingTimeSlice.reducer;
