import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import currencyService from '../../services/currency';
import restCurrencyService from '../../services/rest/currency';

const initialState = {
  loading: false,
  currencies: [],
  defaultCurrency: {},
  error: '',
};

export const fetchCurrencies = createAsyncThunk(
  'currency/fetchCurrencies',
  (params = {}) => {
    return currencyService.getAll(params).then((res) => res);
  }
);
export const fetchRestCurrencies = createAsyncThunk(
  'currency/fetchRestCurrencies',
  (params = {}) => {
    return restCurrencyService.getAll(params).then((res) => res);
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.currencies = payload.data;
      state.defaultCurrency = payload.data.find((item) => item.default);
      state.error = '';
    });
    builder.addCase(fetchCurrencies.rejected, (state, action) => {
      state.loading = false;
      state.currencies = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchRestCurrencies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRestCurrencies.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.currencies = payload.data;
      state.defaultCurrency = payload.data.find((item) => item.default);
      state.error = '';
    });
    builder.addCase(fetchRestCurrencies.rejected, (state, action) => {
      state.loading = false;
      state.currencies = [];
      state.error = action.error.message;
    });
  },
});

export default currencySlice.reducer;
