import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import landingPageService from 'services/landingPage';

const initialState = {
  loading: false,
  data: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchLandingPages = createAsyncThunk(
  'page/fetchLandingPages',
  (params = {}) => {
    return landingPageService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const landingPageSlice = createSlice({
  name: 'landingPages',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLandingPages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLandingPages.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchLandingPages.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default landingPageSlice.reducer;
