import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';

const initialState = {
  loading: false,
  chartData: [],
  productList: [],
  error: '',
};

export const fetchStockProduct = createAsyncThunk(
  'stockReport/fetchStockProduct',
  (params = {}) => {
    return ReportService.getStocks({
      ...params,
    }).then((res) => res);
  }
);
const stockCountSlice = createSlice({
  name: 'stockReport',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchStockProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStockProduct.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.productList = payload.data;
      state.error = '';
    });
    builder.addCase(fetchStockProduct.rejected, (state, action) => {
      state.loading = false;
      state.productList = [];
      state.error = action.error.message;
    });
  },

  reducers: {
    filterStockProduct(state, action) {
      const { payload } = action;
    },
  },
});
export const { filterStockProduct } = stockCountSlice.actions;
export default stockCountSlice.reducer;
