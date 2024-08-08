import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import closeDates from '../../services/closedDays';

const initialState = {
  loading: false,
  closedDays: [],
  error: '',
  meta: {},
};

export const fetCloseDays = createAsyncThunk('close/fetCloseDays', (params) => {
  return closeDates.getById(params).then((res) => res);
});

const CloseDays = createSlice({
  name: 'closeDays',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetCloseDays.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetCloseDays.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.closedDays = payload.data;
      state.error = '';
    });
    builder.addCase(fetCloseDays.rejected, (state, action) => {
      state.loading = false;
      state.closedDays = [];
      state.error = action.error.message;
    });
  },
});

export default CloseDays.reducer;
