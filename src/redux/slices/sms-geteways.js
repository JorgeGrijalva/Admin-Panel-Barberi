import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import smsService from '../../services/smsPayloads';

const initialState = {
  loading: false,
  smsGatewaysList: [],
  error: '',
  meta: {},
};

export const fetchSms = createAsyncThunk('sms/fetchSms', (params) => {
  return smsService.getAll(params).then((res) => res);
});

const sms = createSlice({
  name: 'sms',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSms.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSms.fulfilled, (state, action) => {
      const { payload } = action;
      console.log('payload', payload);
      state.loading = false;
      state.smsGatewaysList = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSms.rejected, (state, action) => {
      state.loading = false;
      state.smsGatewaysList = [];
      state.error = action.error.message;
    });
  },
});

export default sms.reducer;
