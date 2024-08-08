import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopService from 'services/seller/shop';

const initialState = {
  loading: false,
  myShop: {},
  isEnabledStatusChange: false,
  error: '',
};

export const fetchMyShop = createAsyncThunk(
  'shop/fetchMyShop',
  (params = {}) => {
    return shopService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const myShopSlice = createSlice({
  name: 'myShop',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMyShop.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyShop.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.myShop = payload.data;
      state.isEnabledStatusChange = payload.data?.delivery_type === 2;
      state.error = '';
    });
    builder.addCase(fetchMyShop.rejected, (state, action) => {
      state.loading = false;
      state.myShop = {};
      state.error = action.error.message;
    });
  },
});

export default myShopSlice.reducer;
