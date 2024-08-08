import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../../services/blog';

const initialState = {
  loading: false,
  blogs: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'blog',
  },
  meta: {},
};

export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', (params = {}) => {
  return blogService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBlogs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.blogs = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.loading = false;
      state.blogs = [];
      state.error = action.error.message;
    });
  },
});

export default blogSlice.reducer;
