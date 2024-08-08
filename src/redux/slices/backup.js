import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import installationService from '../../services/installation';

const initialState = {
  loading: false,
  history: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBackups = createAsyncThunk(
  'backup/fetchBackups',
  (params = {}) => {
    return installationService
      .getBackupHistory({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const backupSlice = createSlice({
  name: 'backup',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBackups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBackups.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.history = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBackups.rejected, (state, action) => {
      state.loading = false;
      state.history = [];
      state.error = action.error.message;
    });
  },
});

export default backupSlice.reducer;
