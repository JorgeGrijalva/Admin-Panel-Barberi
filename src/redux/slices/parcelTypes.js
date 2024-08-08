import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import parcelTypeService from 'services/parcelType';

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

export const fetchParcelTypes = createAsyncThunk(
  'order/fetchTypes',
  (params = {}) => {
    return parcelTypeService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const parcelTypeSlice = createSlice({
  name: 'parcelType',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchParcelTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchParcelTypes.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data || [];
      state.meta = payload.meta || {};
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchParcelTypes.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export default parcelTypeSlice.reducer;
