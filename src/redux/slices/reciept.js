import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recieptService from '../../services/reciept';
import sellerRecieptService from '../../services/seller/reciept';

const initialState = {
  loading: false,
  recepts: [],
  sellerReciepts: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchRecepts = createAsyncThunk(
  'product/fetchRecepts',
  (params = {}) => {
    return recieptService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerRecepts = createAsyncThunk(
  'product/fetchSellerRecepts',
  (params = {}) => {
    return sellerRecieptService 
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const boxSlice = createSlice({
  name: 'reciept',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRecepts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRecepts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.recepts = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchRecepts.rejected, (state, action) => {
      state.loading = false;
      state.recepts = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchSellerRecepts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerRecepts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sellerReciepts = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerRecepts.rejected, (state, action) => {
      state.loading = false;
      state.reciepts = [];
      state.error = action.error.message;
    });
  },
});

export default boxSlice.reducer;