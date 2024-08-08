import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import faqService from '../../services/faq';

const initialState = {
  loading: false,
  faqs: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchFaqs = createAsyncThunk('faq/fetchFaqs', (params = {}) => {
  return faqService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchFaqs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFaqs.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.faqs = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchFaqs.rejected, (state, action) => {
      state.loading = false;
      state.faqs = [];
      state.error = action.error.message;
    });
  },
});

export default faqSlice.reducer;
