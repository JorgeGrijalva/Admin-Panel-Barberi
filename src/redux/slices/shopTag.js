import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopTagService from '../../services/shopTag';

const initialState = {
  loading: false,
  shopTag: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchShopTag = createAsyncThunk(
  'brand/fetchShopTag',
  (params = {}) => {
    return shopTagService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const shopTag = createSlice({
  name: 'shopTag',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShopTag.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopTag.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shopTag = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchShopTag.rejected, (state, action) => {
      state.loading = false;
      state.shopTag = [];
      state.error = action.error.message;
    });
  },
});

export default shopTag.reducer;
