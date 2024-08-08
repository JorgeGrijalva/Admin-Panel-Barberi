import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import requestModelsService from 'services/seller/request-models';
import adminRequestModelsService from 'services/request-models'

const initialState = {
  loading: false,
  data: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    type: 'category',
  },
  meta: {},
};

export const fetchRequestModels =createAsyncThunk(
    'category/fetchRequestModels',
    (params = {}) => {
      return adminRequestModelsService 
        .getAll({ ...initialState.params, ...params })
        .then((res) => res);
    }
  ); 

export const fetchSellerRequestModels = createAsyncThunk(
  'category/fetchSellerRequestModels',
  (params = {}) => {
    return requestModelsService 
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const requestModelsSlice = createSlice({
  name: 'request-models',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRequestModels.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(fetchRequestModels.fulfilled, (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.data = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      });
      builder.addCase(fetchRequestModels.rejected, (state, action) => {
        state.loading = false;
        state.categories = [];
        state.error = action.error.message;
      });
    builder.addCase(fetchSellerRequestModels.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerRequestModels.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.data = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerRequestModels.rejected, (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.error.message;
    });
  },
});

export default requestModelsSlice.reducer;
