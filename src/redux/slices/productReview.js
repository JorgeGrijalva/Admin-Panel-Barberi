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
    type: 'product',
  },
  meta: {},
};

export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  (params = {}) => {
    return reviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const sellerFetchProductReviews = createAsyncThunk(
  'review/sellerFetchProductReviews',
  (params = {}) => {
    return sellerReviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const productReviewSlice = createSlice({
  name: 'review',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProductReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(sellerFetchProductReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sellerFetchProductReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(sellerFetchProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });
  },
});

export default productReviewSlice.reducer;
