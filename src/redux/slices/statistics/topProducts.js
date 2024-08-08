import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statisticService from '../../../services/statistics';
import sellerStatisticService from '../../../services/seller/statistics';

const initialState = {
  loading: false,
  topProducts: [],
  error: '',
  params: {
    time: 'subMonth',
    perPage: 5,
  },
};

export const fetchTopProducts = createAsyncThunk(
  'statistics/fetchTopProducts',
  (params = {}) => {
    return statisticService
      .topProducts({ ...initialState.params, ...params })
      .then((res) => res);
  },
);
export const fetchSellerTopProducts = createAsyncThunk(
  'statistics/fetchSellerTopProducts',
  (params = {}) => {
    return sellerStatisticService
      .topProducts({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const topProductSlice = createSlice({
  name: 'topProducts',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTopProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopProducts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topProducts = payload.data;
      state.error = '';
    });
    builder.addCase(fetchTopProducts.rejected, (state, action) => {
      state.loading = false;
      state.topProducts = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerTopProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerTopProducts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topProducts = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerTopProducts.rejected, (state, action) => {
      state.loading = false;
      state.topProducts = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    filterTopProducts(state, action) {
      const { payload } = action;
      state.params = payload;
    },
  },
});
export const { filterTopProducts } = topProductSlice.actions;
export default topProductSlice.reducer;
