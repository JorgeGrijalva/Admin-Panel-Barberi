import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import masterService from 'services/rest/masters';

const initialState = {
  loading: false,
  masters: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchMasters = createAsyncThunk(
  'master/fetchMasters',
  (params = {}) => masterService.getAll({ ...initialState.params, ...params })
);

const masterSlice = createSlice({
  name: 'masters',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMasters.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMasters.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.masters = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMasters.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.masters = [];
    });
  },
});

export default masterSlice.reducer;
