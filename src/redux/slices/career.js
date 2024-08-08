import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import careerService from '../../services/career';

const initialState = {
  loading: false,
  career: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchCareer = createAsyncThunk(
  'career/fetchCareer',
  (params = {}) => {
    return careerService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const careerSlice = createSlice({
  name: 'career',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCareer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCareer.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.career = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCareer.rejected, (state, action) => {
      state.loading = false;
      state.career = [];
      state.error = action.error.message;
    });
  },
});

export default careerSlice.reducer;
