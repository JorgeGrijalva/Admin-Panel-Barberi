import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import languagesService from '../../services/languages';

const initialState = {
  loading: false,
  allLanguages: [],
  error: '',
};

export const fetchLang = createAsyncThunk(
  'languages/fetchLanguages',
  (params = {}) => {
    return languagesService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const Languages = createSlice({
  name: 'languages',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLang.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLang.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.allLanguages = payload.data;
      state.error = '';
    });
    builder.addCase(fetchLang.rejected, (state, action) => {
      state.loading = false;
      state.allLanguages = [];
      state.error = action.error.message;
    });
  },
});

export default Languages.reducer;
