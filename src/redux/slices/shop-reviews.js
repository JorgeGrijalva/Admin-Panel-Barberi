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
    type: 'shop',
  },
  meta: {},
};

export const fetchShopReviews = createAsyncThunk(
  'review/fetchShopReviews',
  (params = {}) => {
    return reviewService
      .getAll({ ...initialState.params, ...params, assign: 'shop' })
      .then((res) => res);
  }
);

export const sellerfetchShopReviews = createAsyncThunk(
  'review/sellerfetchShopReviews',
  (params = {}) => {
    return sellerReviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const shopReviewSlice = createSlice({
  name: 'shopReview',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShopReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchShopReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(sellerfetchShopReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sellerfetchShopReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(sellerfetchShopReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });
  },
});

export default shopReviewSlice.reducer;
