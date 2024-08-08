import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import parcelOrderService from 'services/parcelOrder';

const initialState = {
  loading: false,
  data: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};
export const handleSearch = createAsyncThunk(
  'parcel-order/handleSearch',
  (params = {}) => {
    return parcelOrderService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);
export const fetchParcelOrders = createAsyncThunk(
  'parcel-order/fetchOrders',
  (params = {}) => {
    return parcelOrderService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const parcelOrderSlice = createSlice({
  name: 'parcelOrder',
  initialState,
  extraReducers: (builder) => {
    //handleSearch
    builder.addCase(handleSearch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(handleSearch.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.meta = payload.meta;
      state.data = payload.data;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(handleSearch.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //fetchOrders
    builder.addCase(fetchParcelOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchParcelOrders.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchParcelOrders.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});
export default parcelOrderSlice.reducer;
