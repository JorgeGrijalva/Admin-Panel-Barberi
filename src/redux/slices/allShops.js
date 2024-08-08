import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopService from '../../services/restaurant';

const initialState = {
  loading: false,
  allShops: [],
  error: '',
};

export const fetchAllShops = createAsyncThunk(
  'shop/fetchAllShops',
  (params = {}) => {
    return shopService.get(params).then((res) => res);
  }
);

const allShopSlice = createSlice({
  name: 'allShops',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAllShops.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllShops.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.allShops = payload.data.map((item) => ({
        ...item,
        name: item.translation !== null ? item.translation.title : 'no name',
      }));
      state.error = '';
    });
    builder.addCase(fetchAllShops.rejected, (state, action) => {
      state.loading = false;
      state.allShops = [];
      state.error = action.error.message;
    });
  },
});

export default allShopSlice.reducer;
