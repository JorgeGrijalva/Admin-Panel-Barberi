import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user';

const initialState = {
  loading: false,
  roles: [],
  error: '',
};

export const fetchRoles = createAsyncThunk('user/fetchRoles', (params = {}) => {
  return userService.getRoles(params).then((res) => res);
});

const roleSlice = createSlice({
  name: 'role',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.roles = payload.data;
      state.error = '';
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.loading = false;
      state.roles = [];
      state.error = action.error.message;
    });
  },
});

export default roleSlice.reducer;
