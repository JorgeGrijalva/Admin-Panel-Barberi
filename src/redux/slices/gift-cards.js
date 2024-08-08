import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SellerGiftCardService from '../../services/seller/gift-cards';
import GiftCardService from '../../services/gift-card';

const initialState = {
  loading: false,
  giftCards: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  links: null,
  meta: {},
};

export const fetchGiftCards = createAsyncThunk(
  'giftCards/fetchGiftCards',
  (params = {}) =>
    GiftCardService.getAll({ ...initialState.params, ...params }),
);

export const fetchSellerGiftCards = createAsyncThunk(
  'giftCards/fetchSellerGiftCards',
  (params = {}) =>
    SellerGiftCardService.getAll({ ...initialState.params, ...params }),
);

const giftCardSlice = createSlice({
  name: 'giftCards',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchGiftCards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGiftCards.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.giftCards = payload.data.map((item) => ({
        ...item,
        title: item?.translation?.title || 'no name',
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchGiftCards.rejected, (state, action) => {
      state.loading = false;
      state.giftCards = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerGiftCards.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerGiftCards.fulfilled, (state, action) => {
      const { payload } = action;

      state.loading = false;
      state.giftCards = payload.data.map((item) => ({
        ...item,
        title: item?.translation?.title || 'no name',
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerGiftCards.rejected, (state, action) => {
      state.loading = false;
      state.giftCards = [];
      state.error = action.error.message;
    });
  },
});

export default giftCardSlice.reducer;
