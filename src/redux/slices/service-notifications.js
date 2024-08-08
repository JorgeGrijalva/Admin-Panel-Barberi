import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import masterServiceNotificationsService from 'services/master/serviceNotifications';
import adminServiceNotificationsService from 'services/service-notifications';
import sellerServiceNotificationsService from 'services/seller/service-notifications';

const initialState = {
  loading: false,
  serviceNotifications: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchMasterServiceNotifications = createAsyncThunk(
  'serviceNotifications/fetchMasterServiceNotifications',
  (params = {}) =>
    masterServiceNotificationsService.getAll({
      ...initialState.params,
      ...params,
    }),
);

export const fetchAdminServiceNotifications = createAsyncThunk(
  'serviceNotifications/fetchAdminServiceNotifications',
  (params = {}) =>
    adminServiceNotificationsService.getAll({
      ...initialState.params,
      ...params,
    }),
);

export const fetchSellerServiceNotifications = createAsyncThunk(
  'serviceNotifications/fetchSellerServiceNotifications',
  (params = {}) =>
    sellerServiceNotificationsService.getAll({
      ...initialState.params,
      ...params,
    }),
);

const serviceNotificationsSlice = createSlice({
  name: 'serviceNotifications',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMasterServiceNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMasterServiceNotifications.fulfilled,
      (state, action) => {
        state.loading = false;
        const { payload } = action;
        state.serviceNotifications = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      },
    );
    builder.addCase(
      fetchMasterServiceNotifications.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.serviceNotifications = [];
      },
    );
    // admin
    builder.addCase(fetchAdminServiceNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchAdminServiceNotifications.fulfilled,
      (state, action) => {
        state.loading = false;
        const { payload } = action;
        state.serviceNotifications = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      },
    );
    builder.addCase(
      fetchAdminServiceNotifications.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.serviceNotifications = [];
      },
    );
    // seller
    builder.addCase(fetchSellerServiceNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchSellerServiceNotifications.fulfilled,
      (state, action) => {
        state.loading = false;
        const { payload } = action;
        state.serviceNotifications = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.current_page;
        state.params.perPage = payload.meta.per_page;
        state.error = '';
      },
    );
    builder.addCase(
      fetchSellerServiceNotifications.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.serviceNotifications = [];
      },
    );
  },
});

export default serviceNotificationsSlice.reducer;
