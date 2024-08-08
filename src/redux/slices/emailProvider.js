import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import emailService from '../../services/emailSettings';

const initialState = {
  loading: false,
  emailProvider: [],
  error: '',
};

export const fetchEmailProvider = createAsyncThunk(
  'fetch/fetchEmailProvider',
  (params = {}) => {
    return emailService.get({ ...params }).then((res) => res);
  }
);

const emailProvider = createSlice({
  name: 'emailProvider',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchEmailProvider.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmailProvider.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.emailProvider = payload.data;
      state.error = '';
    });
    builder.addCase(fetchEmailProvider.rejected, (state, action) => {
      state.loading = false;
      state.emailProvider = [];
      state.error = action.error.message;
    });
  },
});

export default emailProvider.reducer;
