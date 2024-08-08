import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pointService from '../../services/points';

const initialState = {
  loading: false,
  points: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchPoints = createAsyncThunk(
  'discount/fetchPoints',
  (params = {}) => {
    return pointService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const pointSlice = createSlice({
  name: 'point',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPoints.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPoints.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.points = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchPoints.rejected, (state, action) => {
      state.loading = false;
      state.points = [];
      state.error = action.error.message;
    });
  },
});

export default pointSlice.reducer;
