import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user';
import sellerUserService from '../../services/seller/user';

const initialState = {
  loading: false,
  deliverymans: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    role: 'deliveryman',
  },
  meta: {},
};

export const fetchDeliverymans = createAsyncThunk(
  'delivery/fetchDeliverymans',
  (params = {}) => {
    return userService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);
export const fetchSellerDeliverymans = createAsyncThunk(
  'delivery/fetchSellerDeliverymans',
  (params = {}) => {
    return sellerUserService.getDeliverymans(params).then((res) => res);
  }
);

const deliverymanSlice = createSlice({
  name: 'deliveryman',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchDeliverymans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeliverymans.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.deliverymans = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchDeliverymans.rejected, (state, action) => {
      state.loading = false;
      state.deliverymans = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerDeliverymans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerDeliverymans.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.deliverymans = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerDeliverymans.rejected, (state, action) => {
      state.loading = false;
      state.deliverymans = [];
      state.error = action.error.message;
    });
  },
});

export default deliverymanSlice.reducer;
