import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import areaService from 'services/deliveryzone/area';

const initialState = {
  loading: false,
  list: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchArea = createAsyncThunk(
  'deliveryzone/fetchArea',
  (params = {}) => {
    return areaService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const backupSlice = createSlice({
  name: 'deliveryArea',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchArea.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchArea.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchArea.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });
  },
});

export default backupSlice.reducer;
