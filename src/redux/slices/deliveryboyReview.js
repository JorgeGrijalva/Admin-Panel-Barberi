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
    assign: 'deliveryman',
  },
  meta: {},
};

export const fetchDeliveryboyReviews = createAsyncThunk(
  'review/fetchDeliveryboyReviews',
  (params = {}) => {
    return reviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const sellerfetchDeliveryboyReviews = createAsyncThunk(
  'review/sellerfetchDeliveryboyReviews',
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
    builder.addCase(fetchDeliveryboyReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeliveryboyReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchDeliveryboyReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(sellerfetchDeliveryboyReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      sellerfetchDeliveryboyReviews.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.reviews = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      }
    );
    builder.addCase(sellerfetchDeliveryboyReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });
  },
});

export default orderReviewSlice.reducer;
