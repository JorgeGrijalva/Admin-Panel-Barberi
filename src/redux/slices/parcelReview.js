import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/review';

const initialState = {
  loading: false,
  reviews: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'parcel',
  },
  meta: {},
};

export const fetchParcelReviews = createAsyncThunk(
  'review/fetchParcelReviews',
  (params = {}) => {
    return reviewService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);


const parcelReviewSlice = createSlice({
  name: 'parcelReviews',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchParcelReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchParcelReviews.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.reviews = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchParcelReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message;
    });

  },
});

export default parcelReviewSlice.reducer;
