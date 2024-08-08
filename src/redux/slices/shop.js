import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopService from '../../services/shop';

const initialState = {
  loading: false,
  shops: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    // role: 'seller',
  },
  meta: {},
};

export const fetchShops = createAsyncThunk('shop/fetchShops', (params = {}) => {
  return shopService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchShops.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShops.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shops = payload.data.map((item) => ({
        created_at: item.created_at,
        active: item.show_type,
        tax: item.tax,
        open: item.open,
        name: item.translation !== null ? item.translation.title : 'no name',
        seller: item.seller
          ? item.seller.firstname + ' ' + item.seller.lastname
          : '',
        uuid: item.uuid,
        logo_img: item.logo_img,
        back: item.background_img,
        id: item.id,
        locales: item.locales,
        status: item.status,
        verify: item.verify,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchShops.rejected, (state, action) => {
      state.loading = false;
      state.shops = [];
      state.error = action.error.message;
    });
  },
});

export default shopSlice.reducer;
