import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import bookingService from 'services/booking';
import sellerBookingService from 'services/seller/booking';
import masterBookingService from 'services/master/booking';

const initialState = {
  loading: false,
  bookingList: [],
  error: '',
  params: {
    page: 1,
    perPage: 100,
  },
  meta: {},
  data: {
    current_tab: 'all',
    free_from: null,
    free_to: null,
    reload: null,
  },
};

export const fetchBookingList = createAsyncThunk(
  'booking/fetchBookingList',
  (params = {}) => {
    return bookingService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerBookingList = createAsyncThunk(
  'booking/fetchSellerBookingList',
  (params = {}) => {
    return sellerBookingService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchMasterBookingList = createAsyncThunk(
  'booking/fetchMasterBookingList',
  (params = {}) => {
    return masterBookingService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData(state, action) {
      const { payload } = action;
      state.data = { ...state.data, ...payload };
    },
    updateBookingData(state, action) {
      const { payload } = action;
      state.bookingList = [...state.bookingList, payload];
    },
  },
  extraReducers: (builder) => {
    //admin
    builder.addCase(fetchBookingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bookingList = payload.data?.map((item) => ({
        id: item.id,
        pause: item.service_master?.pause,
        title: item.service_master?.service?.translation?.title,
        start: new Date(
          new Date(moment(item.start_date, 'YYYY-MM-DD HH:mm:ss'))
        ),
        end: new Date(moment(item.end_date, 'YYYY-MM-DD HH:mm:ss')),
        parent_id: item.parent_id || item.id,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBookingList.rejected, (state, action) => {
      state.loading = false;
      state.bookingList = [];
      state.error = action.error.message;
    });

    //seller

    builder.addCase(fetchSellerBookingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerBookingList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bookingList = payload.data?.map((item) => ({
        id: item.id,
        pause: item.service_master?.pause,
        title: item.service_master?.service?.translation?.title,
        start: new Date(
          new Date(moment(item.start_date, 'YYYY-MM-DD HH:mm:ss'))
        ),
        end: new Date(moment(item.end_date, 'YYYY-MM-DD HH:mm:ss')),
        parent_id: item.parent_id || item.id,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerBookingList.rejected, (state, action) => {
      state.loading = false;
      state.bookingList = [];
      state.error = action.error.message;
    });

    //master

    builder.addCase(fetchMasterBookingList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMasterBookingList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bookingList = payload.data?.map((item) => ({
        id: item.id,
        pause: item.service_master?.pause,
        title: item.service_master?.service?.translation?.title,
        start: new Date(
          new Date(moment(item.start_date, 'YYYY-MM-DD HH:mm:ss'))
        ),
        end: new Date(moment(item.end_date, 'YYYY-MM-DD HH:mm:ss')),
        parent_id: item.parent_id || item.id,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMasterBookingList.rejected, (state, action) => {
      state.loading = false;
      state.bookingList = [];
      state.error = action.error.message;
    });
  },
});

export const { setBookingData, updateBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
