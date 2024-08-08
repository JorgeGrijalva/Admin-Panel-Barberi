import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponService from 'services/coupon';

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
    'category/fetchCoupon',
    (params = {}) => {
        return couponService
            .getAll({ ...initialState.params, ...params })
            .then((res) => res);
    }
);

const couponsSlice = createSlice({
    name: 'category',
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
