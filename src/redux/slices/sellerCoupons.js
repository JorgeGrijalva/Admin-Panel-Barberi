import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerCouponService from 'services/seller/coupon';

const initialState = {
  loading: false,
  coupons: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchCoupon = createAsyncThunk(
  'seller/category/fetchCoupon',
  (params = {}) => {
    return sellerCouponService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const couponsSlice = createSlice({
  name: 'seller/category',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCoupon.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCoupon.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.coupons = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCoupon.rejected, (state, action) => {
      state.loading = false;
      state.coupons = [];
      state.error = action.error.message;
    });
  },
});

export default couponsSlice.reducer;
