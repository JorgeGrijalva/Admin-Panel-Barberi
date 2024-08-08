import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/category';

const initialState = {
  loading: false,
  menuCategories: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'menu',
  },
  meta: {},
};

export const fetchMenuCategories = createAsyncThunk(
  'category/fetchMenuCategories',
  (params = {}) => {
    return categoryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const menuCategorySlice = createSlice({
  name: 'menu-category',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMenuCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMenuCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.menuCategories = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMenuCategories.rejected, (state, action) => {
      state.loading = false;
      state.menuCategories = [];
      state.error = action.error.message;
    });
  },
});

export default menuCategorySlice.reducer;
