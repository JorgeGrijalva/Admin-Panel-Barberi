import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeisService from '../../services/seller/storeis';
import storeisAdminService from '../../services/storeis';

const initialState = {
  loading: false,
  storeis: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchStoreis = createAsyncThunk(
  'story/fetchStoreis',
  (params = {}) => {
    return storeisService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchAdminStoreis = createAsyncThunk(
  'story/fetchAdminStoreis',
  (params = {}) => {
    return storeisAdminService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const storeisSlice = createSlice({
  name: 'storeis',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAdminStoreis.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminStoreis.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.storeis = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchAdminStoreis.rejected, (state, action) => {
      state.loading = false;
      state.storeis = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchStoreis.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStoreis.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.storeis = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchStoreis.rejected, (state, action) => {
      state.loading = false;
      state.storeis = [];
      state.error = action.error.message;
    });
  },
});

export default storeisSlice.reducer;
