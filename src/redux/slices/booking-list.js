import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import Booking from 'services/booking';
import SellerBooking from 'services/seller/booking';

const initialState = {
  loading: false,
  booking: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

// export const fetchBookingList = createAsyncThunk(
//   'booking/fetchBookingList',
//   (params = {}) => {
//     return Booking.getAll({ ...initialState.params, ...params }).then(
//       (res) => res
//     );
//   }
// );

export const fetchSellerBookingList = createAsyncThunk(
  'booking/fetchSellerBookingList',
  (params = {}) => {
    return SellerBooking.getAll({ ...initialState.params, ...params }).then(
      (res) => res
    );
  }
);

const bookingListSlice = createSlice({
  name: 'bookingList',
  initialState,
  extraReducers: (builder) => {
    // builder.addCase(fetchBookingList.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(fetchBookingList.fulfilled, (state, action) => {
    //   const { payload } = action;
    //   state.loading = false;
    //   state.booking = payload.data;
    //   state.meta = payload.meta;
    //   state.params.page = payload.meta.current_page;
    //   state.params.perPage = payload.meta.per_page;
    //   state.error = '';
    // });
    // builder.addCase(fetchBookingList.rejected, (state, action) => {
    //   state.loading = false;
    //   state.booking = [];
    //   state.error = action.error.message;
    // });

    // seller
    builder.addCase(fetchSellerBookingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerBookingList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.booking = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerBookingList.rejected, (state, action) => {
      state.loading = false;
      state.booking = [];
      state.error = action.error.message;
    });
  },
});

export default bookingListSlice.reducer;