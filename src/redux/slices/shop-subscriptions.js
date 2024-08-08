import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ShopSubscriptionsService from '../../services/shop-subscriptions';

const initialState = {
  loading: false,
  shopSubscriptions: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
    status: null,
  },
  meta: {},
};

export const fetchShopSubscriptions = createAsyncThunk(
  'shopSubscriptions/fetchShopSubscriptions',
  (params = {}) =>
    ShopSubscriptionsService.getAll({ ...initialState.params, ...params }),
);

const shopSubscriptionsSlice = createSlice({
  name: 'shopSubscriptions',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchShopSubscriptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopSubscriptions.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shopSubscriptions = payload.data.map((item) => ({
        ...item,
        shopTitle: item.shop?.translation?.title,
        subscriptionTitle: item.subscription?.title,
        subscriptionType: item.subscription?.type,
        transaction: item.transaction,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchShopSubscriptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.shopSubscriptions = [];
    });
  },
});

export default shopSubscriptionsSlice.reducer;
