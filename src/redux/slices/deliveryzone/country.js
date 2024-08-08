import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import countryService from 'services/deliveryzone/country';

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

export const fetchCountry = createAsyncThunk(
  'deliveryzone/fetchCountry',
  (params = {}) => {
    return countryService
      .get({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const backupSlice = createSlice({
  name: 'deliveryCountries',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCountry.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCountry.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCountry.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });
  },
});

export default backupSlice.reducer;
