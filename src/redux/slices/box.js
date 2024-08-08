import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boxService from '../../services/box';
import sellerBoxService from '../../services/seller/box';

const initialState = {
  loading: false,
  boxes: [],
  sellerBoxes: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchBoxes = createAsyncThunk(
  'product/fetchBoxes',
  (params = {}) => {
    return boxService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerBoxes = createAsyncThunk(
  'product/fetchSellerBoxes',
  (params = {}) => {
    return sellerBoxService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const boxSlice = createSlice({
  name: 'box',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBoxes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBoxes.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.boxes = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchBoxes.rejected, (state, action) => {
      state.loading = false;
      state.boxes = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchSellerBoxes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerBoxes.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.sellerBoxes = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerBoxes.rejected, (state, action) => {
      state.loading = false;
      state.boxes = [];
      state.error = action.error.message;
    });
  },
});

export default boxSlice.reducer;