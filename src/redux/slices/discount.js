import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import discountService from '../../services/seller/discount';

const initialState = {
  loading: false,
  discounts: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchDiscounts = createAsyncThunk(
  'discount/fetchDiscounts',
  (params = {}) => {
    return discountService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchDiscounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDiscounts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.discounts = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchDiscounts.rejected, (state, action) => {
      state.loading = false;
      state.discounts = [];
      state.error = action.error.message;
    });
  },
});

export default discountSlice.reducer;
