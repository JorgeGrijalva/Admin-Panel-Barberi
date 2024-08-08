import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import formOptionService from '../../services/form-option';
import sellerFormOptionService from '../../services/seller/form-option';
import masterFormOptionsService from '../../services/master/form-options';

const initialState = {
  loading: false,
  formOptions: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  links: null,
  meta: {},
};

export const fetchFormOptions = createAsyncThunk(
  'formOptions/fetchFormOptions',
  (params = {}) =>
    formOptionService.getAll({ ...initialState.params, ...params }),
);

export const fetchSellerFormOptions = createAsyncThunk(
  'formOptions/fetchSellerFormOptions',
  (params = {}) =>
    sellerFormOptionService.getAll({ ...initialState.params, ...params }),
);

export const fetchMasterFormOptions = createAsyncThunk(
  'formOptions/fetchMasterFormOptions',
  (params = {}) =>
    masterFormOptionsService.getAll({ ...initialState.params, ...params }),
);

const formOptionsSlice = createSlice({
  name: 'formOptions',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchFormOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFormOptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.formOptions = action.payload.data.map((item) => ({
        id: item.id,
        title: item?.translation?.title,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchFormOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.formOptions = [];
    });

    builder.addCase(fetchSellerFormOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerFormOptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.formOptions = action.payload.data.map((item) => ({
        id: item.id,
        title: item?.translation?.title,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerFormOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.formOptions = [];
    });

    builder.addCase(fetchMasterFormOptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMasterFormOptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.formOptions = action.payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMasterFormOptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.formOptions = [];
    });
  },
});

export default formOptionsSlice.reducer;
