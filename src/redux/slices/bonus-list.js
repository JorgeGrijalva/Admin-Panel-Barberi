import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bonnusService from '../../services/bonus';

const initialState = {
  loading: false,
  bonus: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBonusList = createAsyncThunk(
  'story/fetchStoreis',
  (params = {}) => {
    return bonnusService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bonusSlice = createSlice({
  name: 'bonus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBonusList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBonusList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bonus = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBonusList.rejected, (state, action) => {
      state.loading = false;
      state.bonus = [];
      state.error = action.error.message;
    });
  },
});

export default bonusSlice.reducer;
