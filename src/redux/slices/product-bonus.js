import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bonusService from '../../services/seller/bonus';

const initialState = {
  loading: false,
  bonus: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'product',
  },
  meta: {},
};

export const fetchBonus = createAsyncThunk(
  'bonus/fetchBonus',
  (params = {}) => {
    return bonusService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const bonus = createSlice({
  name: 'bonus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBonus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBonus.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.bonus = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBonus.rejected, (state, action) => {
      state.loading = false;
      state.bonus = [];
      state.error = action.error.message;
    });
  },
});

export default bonus.reducer;
