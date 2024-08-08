import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workingDays from '../../services/workingDays';

const initialState = {
  loading: false,
  workingDays: [],
  error: '',
  meta: {},
};

export const fetchWorkingDays = createAsyncThunk(
  'working/fetchWorkingDays',
  (params) => {
    return workingDays.getById(params).then((res) => res);
  }
);

const WorkingDays = createSlice({
  name: 'working',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchWorkingDays.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWorkingDays.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.workingDays = payload.data.closed_dates.map((itm) => itm.day);
      state.error = '';
    });
    builder.addCase(fetchWorkingDays.rejected, (state, action) => {
      state.loading = false;
      state.workingDays = [];
      state.error = action.error.message;
    });
  },
});

export default WorkingDays.reducer;
