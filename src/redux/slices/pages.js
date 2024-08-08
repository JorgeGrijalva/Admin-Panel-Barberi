import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pageService from '../../services/pages';

const initialState = {
  loading: false,
  pages: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchPages = createAsyncThunk('page/fetchPages', (params = {}) => {
  return pageService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPages.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.pages = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchPages.rejected, (state, action) => {
      state.loading = false;
      state.pages = [];
      state.error = action.error.message;
    });
  },
});

export default pagesSlice.reducer;
