import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/review';
import sellerReviewService from '../../services/seller/review';

const initialState = {
  loading: false,
  reviews: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'order',
  },
  meta: {},
};

export const fetchOrderReviews = createAsyncThunk(
  'review/fetchOrderReviews',
  (params = {}) => {
    return reviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const sellerfetchOrderReviews = createAsyncThunk(
  'review/sellerfetchOrderReviews',
  (params = {}) => {
    return sellerReviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const orderReviewSlice = createSlice({
  name: 'review',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrderReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchOrderReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(sellerfetchOrderReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sellerfetchOrderReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(sellerfetchOrderReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });
  },
});

export default orderReviewSlice.reducer;
