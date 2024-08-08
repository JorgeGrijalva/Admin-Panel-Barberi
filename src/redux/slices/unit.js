import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import unitService from '../../services/unit';

const initialState = {
  loading: false,
  units: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchUnits = createAsyncThunk('unit/fetchUnits', (params = {}) => {
  return unitService
    .getAll({ ...initialState.params, ...params })
    .then((res) => res);
});

const unitSlice = createSlice({
  name: 'unit',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUnits.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUnits.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.units = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchUnits.rejected, (state, action) => {
      state.loading = false;
      state.units = [];
      state.error = action.error.message;
    });
  },
});

export default unitSlice.reducer;
