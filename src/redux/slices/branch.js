import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import branchService from '../../services/seller/branch';

const initialState = {
  loading: false,
  branches: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBranch = createAsyncThunk(
  'branch/fetchBranch',
  (params = {}) => {
    return branchService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res)
      .catch((err) => err);
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBranch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBranch.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.branches = payload.data;
      state.meta = payload?.meta;
      state.params.page = payload?.meta?.current_page;
      state.params.perPage = payload?.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchBranch.rejected, (state, action) => {
      state.loading = false;
      state.branches = [];
      state.error = action.error?.message;
    });
  },
});

export default branchSlice.reducer;
