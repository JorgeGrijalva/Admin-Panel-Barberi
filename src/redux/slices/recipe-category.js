import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/category';
import sellerCategory from '../../services/seller/category';

const initialState = {
  loading: false,
  categories: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'receipt',
  },
  meta: {},
};

export const fetchRecipeCategories = createAsyncThunk(
  'category/fetchRecipeCategories',
  (params = {}) => {
    return categoryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerRecipeCategories = createAsyncThunk(
  'category/fetchSellerRecipeCategories',
  (params = {}) => {
    return sellerCategory
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const recipeCategorySlice = createSlice({
  name: 'recipe-category',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRecipeCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecipeCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.categories = payload.data.map((item) => ({
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
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchRecipeCategories.rejected, (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchSellerRecipeCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerRecipeCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.categories = payload.data.map((item) => ({
        active: item.active,
        img: item.img,
        name: item.translation !== null ? item.translation.title : 'no name',
        key: item.uuid + '_' + item.id,
        uuid: item.uuid,
        id: item.id,
        locales: item.locales,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerRecipeCategories.rejected, (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.error.message;
    });
  },
});

export default recipeCategorySlice.reducer;
