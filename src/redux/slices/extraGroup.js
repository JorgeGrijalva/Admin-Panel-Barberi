import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import extraService from '../../services/extra';
import extraSellerService from '../../services/seller/extras';

const initialState = {
  loading: false,
  extraGroups: [],
  error: '',
  meta: {},
};

export const fetchExtraGroups = createAsyncThunk(
  'extra/fetchExtraGroups',
  (params = {}) => {
    return extraService
      .getAllGroups({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchSellerExtraGroups = createAsyncThunk(
  'extra/fetchSellerExtraGroups',
  (params = {}) => {
    return extraSellerService
      .getAllGroups({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const extraGroupSlice = createSlice({
  name: 'extraGroup',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchExtraGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExtraGroups.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.extraGroups = payload.data;
      state.error = '';
      state.meta = payload.meta;
    });
    builder.addCase(fetchExtraGroups.rejected, (state, action) => {
      state.loading = false;
      state.extraGroups = [];
      state.error = action.error.message;
      state.meta = {};
    });

    builder.addCase(fetchSellerExtraGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerExtraGroups.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.extraGroups = payload.data;
      state.error = '';
      state.meta = payload.meta;
    });
    builder.addCase(fetchSellerExtraGroups.rejected, (state, action) => {
      state.loading = false;
      state.extraGroups = [];
      state.error = action.error.message;
      state.meta = {};
    });
  },
});

export default extraGroupSlice.reducer;
