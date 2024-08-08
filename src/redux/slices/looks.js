import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import looksService from 'services/banner';
import sellerLooksService from 'services/seller/banner';

const initialState = {
  loading: false,
  looks: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'look',
  },
  meta: {},
};

export const fetchLooks = createAsyncThunk('look/fetchLooks', (params = {}) => {
  return looksService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

export const sellerFetchLooks = createAsyncThunk(
  'look/sellerFetchLooks',
  (params = {}) => {
    return sellerLooksService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const lookSlice = createSlice({
  name: 'look',
  initialState,
  extraReducers: (builder) => {
    //admin
    builder.addCase(fetchLooks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchLooks.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.looks = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });

    builder.addCase(fetchLooks.rejected, (state, action) => {
      state.loading = false;
      state.looks = [];
      state.error = action.error.message;
    });

    //seller
    builder.addCase(sellerFetchLooks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(sellerFetchLooks.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.looks = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });

    builder.addCase(sellerFetchLooks.rejected, (state, action) => {
      state.loading = false;
      state.looks = [];
      state.error = action.error.message;
    });
  },
});

export default lookSlice.reducer;
