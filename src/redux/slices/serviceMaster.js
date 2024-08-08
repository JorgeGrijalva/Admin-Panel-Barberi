import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import masterServiceMasterService from '../../services/master/serviceMaster';
import adminServiceMasterService from 'services/service-master';
import sellerServiceMasterService from 'services/seller/service-master';

const initialState = {
  loading: false,
  serviceMaster: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchMasterServiceMaster = createAsyncThunk(
  'serviceMaster/fetchServiceMaster',
  (params = {}) =>
    masterServiceMasterService.get({ ...initialState.params, ...params }),
);

export const fetchAdminServiceMaster = createAsyncThunk(
  'serviceMaster/fetchAdminServiceMaster',
  (params = {}) =>
    adminServiceMasterService.getAll({ ...initialState.params, ...params }),
);

export const fetchSellerServiceMaster = createAsyncThunk(
  'serviceMaster/fetchSellerServiceMaster',
  (params = {}) =>
    sellerServiceMasterService.getAll({ ...initialState.params, ...params }),
);

const serviceMasterSlice = createSlice({
  name: 'serviceMaster',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMasterServiceMaster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMasterServiceMaster.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.serviceMaster = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMasterServiceMaster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.serviceMaster = [];
    });
    // admin
    builder.addCase(fetchAdminServiceMaster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminServiceMaster.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.serviceMaster = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchAdminServiceMaster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.serviceMaster = [];
    });
    // seller
    builder.addCase(fetchSellerServiceMaster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerServiceMaster.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.serviceMaster = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerServiceMaster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.serviceMaster = [];
    });
  },
});

export default serviceMasterSlice.reducer;
