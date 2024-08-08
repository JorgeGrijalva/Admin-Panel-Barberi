import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import paymentToPartnerService from 'services/payment-to-partner';
import paymentFromPartnerService from 'services/seller/payment-from-partner';
import paymentFromPartnerDeliveryService from 'services/deliveryman/payment-from-partner';

const initialState = {
  loading: false,
  list: [],
  completedList: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchPaymentToPartnersList = createAsyncThunk(
  'paymentToPartners',
  ({ params, name } = {}) =>
    paymentToPartnerService.getAllTransactions(params, name).then((res) => res),
);

export const fetchPaymentToPartnersCompletedList = createAsyncThunk(
  'paymentToPartnersComplete',
  (params = {}) => paymentToPartnerService.getAll(params).then((res) => res),
);

export const fetchPaymentFromPartners = createAsyncThunk(
  'paymentFromPartners',
  (params = {}) => paymentFromPartnerService.getAll(params).then((res) => res),
);

export const fetchDeliverymanPaymentFromPartners = createAsyncThunk(
  'deliverymanPaymentFromPartners',
  (params = {}) =>
    paymentFromPartnerDeliveryService.getAll(params).then((res) => res),
);

const paymentToPartnersSlice = createSlice({
  name: 'paymentToPartners',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentToPartnersList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPaymentToPartnersList.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.data.meta;
      state.params.page = payload.data.meta.page;
      state.params.perPage = payload.data.meta.perPage;
      state.error = '';
    });
    builder.addCase(fetchPaymentToPartnersList.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchPaymentToPartnersCompletedList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchPaymentToPartnersCompletedList.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.completedList = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.page;
        state.params.perPage = payload.meta.perPage;
        state.error = '';
      },
    );
    builder.addCase(
      fetchPaymentToPartnersCompletedList.rejected,
      (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.error.message;
      },
    );

    builder.addCase(fetchPaymentFromPartners.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPaymentFromPartners.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.list = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.page;
      state.params.perPage = payload.meta.perPage;
      state.error = '';
    });
    builder.addCase(fetchPaymentFromPartners.rejected, (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchDeliverymanPaymentFromPartners.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchDeliverymanPaymentFromPartners.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.list = payload.data;
        state.meta = payload.meta;
        state.params.page = payload.meta.page;
        state.params.perPage = payload.meta.perPage;
        state.error = '';
      },
    );
    builder.addCase(
      fetchDeliverymanPaymentFromPartners.rejected,
      (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.error.message;
      },
    );
  },
});

export default paymentToPartnersSlice.reducer;
