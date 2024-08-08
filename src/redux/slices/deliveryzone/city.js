import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cityService from 'services/deliveryzone/city';

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

export const fetchCity = createAsyncThunk(
  'deliveryzone/fetchCity',
  (params = {}) => {
    return cityService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const backupSlice = createSlice({
  name: 'deliveryCity',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCity.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCity.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });
  },
});

export default backupSlice.reducer;
