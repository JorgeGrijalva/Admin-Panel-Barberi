import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import restaurantService from '../../services/restaurant';

const initialState = {
  loading: false,
  restourants: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'restaurant',
    role: 'seller',
  },
  meta: {},
};

export const fetchRestourant = createAsyncThunk(
  'shop/fetchRestourant',
  (params = {}) => {
    return restaurantService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const restourantSlice = createSlice({
  name: 'restourants',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRestourant.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRestourant.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.restourants = payload.data.map((item) => ({
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
        status: item.status,
        locales: item.locales,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchRestourant.rejected, (state, action) => {
      state.loading = false;
      state.restourants = [];
      state.error = action.error.message;
    });
  },
});

export default restourantSlice.reducer;
