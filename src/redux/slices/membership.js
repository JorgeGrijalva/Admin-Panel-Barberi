import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import membershipService from 'services/membership';
import sellerMembershipService from 'services/seller/membership';

const initialState = {
  loading: false,
  memberShipData: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
  seller: {
    loading: false,
    memberShipData: [],
    error: '',
    params: {
      page: 1,
      perPage: 10,
    },
    meta: {},
  },
};

export const fetchMemberShip = createAsyncThunk(
  'membership/fetchMemberShip',
  (params = {}) => {
    return membershipService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

export const fetchSellerMembership = createAsyncThunk(
  'membership/fetchSellerMembership',
  (params = {}) => {
    return sellerMembershipService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  extraReducers: (builder) => {
    // admin
    builder.addCase(fetchMemberShip.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMemberShip.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.memberShipData = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchMemberShip.rejected, (state, action) => {
      state.loading = false;
      state.memberShipData = [];
      state.error = action.error.message;
    });

    // seller
    builder.addCase(fetchSellerMembership.pending, (state) => {
      state.seller.loading = true;
    });
    builder.addCase(fetchSellerMembership.fulfilled, (state, action) => {
      const { payload } = action;
      state.seller.loading = false;
      state.seller.memberShipData = payload.data;
      state.seller.meta = payload.meta;
      state.seller.params.page = payload.meta.current_page;
      state.seller.params.perPage = payload.meta.per_page;
      state.seller.error = '';
    });
    builder.addCase(fetchSellerMembership.rejected, (state, action) => {
      state.seller.loading = false;
      state.seller.memberShipData = [];
      state.seller.error = action.error.message;
    });
  },
});

export default membershipSlice.reducer;
