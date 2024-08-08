import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/category';

const initialState = {
  loading: false,
  careerCategory: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'career',
  },
  meta: {},
};

export const fetchCareerCategories = createAsyncThunk(
  'category/fetchCareerCategories',
  (params = {}) => {
    return categoryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const careerCategorySlice = createSlice({
  name: 'career-category',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCareerCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCareerCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.careerCategory = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCareerCategories.rejected, (state, action) => {
      state.loading = false;
      state.careerCategory = [];
      state.error = action.error.message;
    });
  },
});

export default careerCategorySlice.reducer;
