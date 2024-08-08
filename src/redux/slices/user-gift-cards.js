import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userGiftCardsService from '../../services/user-gift-cards';

const initialState = {
  loading: false,
  userGiftCards: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchUserGiftCards = createAsyncThunk(
  'userGiftCards/fetchUserGiftCards',
  (params = {}) =>
    userGiftCardsService.getAll({ ...initialState.params, ...params }),
);

const userGiftCardsSlice = createSlice({
  name: 'userGiftCards',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchUserGiftCards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserGiftCards.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.userGiftCards = payload.data;
      state.error = '';
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
    });
    builder.addCase(fetchUserGiftCards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.userGiftCards = [];
    });
  },
});

export default userGiftCardsSlice.reducer;
