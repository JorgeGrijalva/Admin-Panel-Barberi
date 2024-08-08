import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cityService from 'services/deliveryzone/region';

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

export const fetchRegion = createAsyncThunk(
  'deliveryzone/fetchRegion',
  (params = {}) => {
    return cityService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const backupSlice = createSlice({
  name: 'deliveryRegion',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRegion.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRegion.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchRegion.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });
  },
});

export default backupSlice.reducer;
