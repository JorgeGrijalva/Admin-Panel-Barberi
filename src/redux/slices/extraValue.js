import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import extraService from '../../services/extra';
import sellerExtraService from '../../services/seller/extras';

const initialState = {
  loading: false,
  extraValues: [],
  meta: {},
  error: '',
};

export const fetchExtraValues = createAsyncThunk(
  'extra/fetchExtraValues',
  (params = {}) => {
    return extraService
      .getAllValues({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

export const fetchSellerExtraValue = createAsyncThunk(
  'extra/fetchSellerExtraValue',
  (params = {}) => {
    return sellerExtraService
      .getAllValues({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const extraValueSlice = createSlice({
  name: 'extraValue',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchExtraValues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExtraValues.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.extraValues = payload.data;
      state.meta = payload.meta;
      state.error = '';
    });
    builder.addCase(fetchExtraValues.rejected, (state, action) => {
      state.loading = false;
      state.extraValues = [];
      state.meta = {};
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerExtraValue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerExtraValue.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.extraValues = payload.data;
      state.meta = payload.meta;
      state.error = '';
    });
    builder.addCase(fetchSellerExtraValue.rejected, (state, action) => {
      state.loading = false;
      state.extraValues = [];
      state.meta = {};
      state.error = action.error.message;
    });
  },
});

export default extraValueSlice.reducer;
