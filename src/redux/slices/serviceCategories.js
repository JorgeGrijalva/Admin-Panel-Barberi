import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import categoryService from '../../services/category';
import sellerCategory from '../../services/seller/category';

const initialState = {
  loading: false,
  serviceCategories: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchServiceCategories = createAsyncThunk(
  'serviceCategory/fetchServiceCategories',
  (params = {}) => {
    return categoryService
      .getAllMain({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const serviceCategoriesSlice = createSlice({
  name: 'serviceCategory',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchServiceCategories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.serviceCategories = payload.data.map((item) => ({
        active: item.active,
        img: item.img,
        name: item.translation !== null ? item.translation.title : 'no name',
        key: item.uuid + '_' + item.id,
        uuid: item.uuid,
        id: item.id,
        locales: item.locales,
        status: item.status,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchServiceCategories.rejected, (state, action) => {
      state.loading = false;
      state.serviceCategories = [];
      state.error = action.error.message;
    });
  },
});

export default serviceCategoriesSlice.reducer;
