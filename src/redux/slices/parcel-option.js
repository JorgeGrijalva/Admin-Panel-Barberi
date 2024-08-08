import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import parcelOptionService from 'services/parcel-option';

const initialState = {
  loading: false,
  options: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchParcelOptions = createAsyncThunk('unit/fetchParcelOptions', (params = {}) => {
  return parcelOptionService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const parcelOptionSlice = createSlice({
  name: 'parcelOption',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchParcelOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchParcelOptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.options = payload.data;
      state.meta = payload.meta;
      state.params.page = payload?.meta?.current_page;
      state.params.perPage = payload?.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchParcelOptions.rejected, (state, action) => {
      state.loading = false;
      state.options = [];
      state.error = action.error.message;
    });
  },
});

export default parcelOptionSlice.reducer;
