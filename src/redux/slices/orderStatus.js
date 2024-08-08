import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import OrderStatusService from '../../services/orderStatus';

const initialState = {
  loading: false,
  statusList: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchOrderStatus = createAsyncThunk(
  'payout/fetchOrderStatus',
  (params = {}) => {
    return OrderStatusService.getAll({
      ...initialState.params,
      ...params,
    }).then((res) => res);
  },
);

export const fetchRestOrderStatus = createAsyncThunk(
  'payout/fetchRestOrderStatus',
  (params = {}) => {
    return OrderStatusService.get({
      ...initialState.params,
      ...params,
    }).then((res) => res);
  },
);

const payoutSlice = createSlice({
  name: 'orderStatus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrderStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderStatus.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.statusList = payload.data;
      state.statusList.sort((a, b) => a.sort - b.sort);
      state.error = '';
    });
    builder.addCase(fetchOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.statusList = [];
      state.error = action.error.message;
    });

    // rest
    builder.addCase(fetchRestOrderStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRestOrderStatus.fulfilled, (state, action) => {
      const { payload } = action;

      state.loading = false;
      state.statusList = payload.data;
      state.statusList.sort((a, b) => a.sort - b.sort);
      state.error = '';
    });
    builder.addCase(fetchRestOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.statusList = [];
      state.error = action.error.message;
    });
  },
});

export default payoutSlice.reducer;
