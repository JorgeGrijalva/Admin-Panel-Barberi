import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import advertService from 'services/advert';
import sellerAdvertService from 'services/seller/advert'

const initialState = {
  loading: false,
  advertList: [],
  shopAdList: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchAdverts = createAsyncThunk(
  'advert/fetchAdverts',
  (params = {}) => {
    return advertService
      .getAll({ ...initialState.params, ...params })
      .then((res) => {
        return res;
      });
  }
);

export const fetchSellerAdverts = createAsyncThunk(
  'advert/fetchSellerAdverts',
  (params = {}) => {
    return sellerAdvertService 
      .getAll({ ...initialState.params, ...params })
      .then((res) => {
        return res;
      });
  }
);

export const fetchShopAdverts = createAsyncThunk(
  'advert/fetchShopAdverts',
  (params = {}) => {
    return sellerAdvertService 
      .shopAdList({ ...initialState.params, ...params })
      .then((res) => {
        return res;
      });
  }
);


const advertsSlice = createSlice({
  name: 'advert',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAdverts.pending, (state) => {
      state.advertList=[];
      state.loading = true;
    });

    builder.addCase(fetchAdverts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.advertList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.perPage;
      state.error = '';
    });

    builder.addCase(fetchAdverts.rejected, (state, action) => {
      state.loading = false;
      state.advertList = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerAdverts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSellerAdverts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.advertList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.perPage;
      state.error = '';
    });

    builder.addCase(fetchSellerAdverts.rejected, (state, action) => {
      state.loading = false;
      state.advertList = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchShopAdverts.pending, (state) => {
       state.loading = true;
    });

    builder.addCase(fetchShopAdverts.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.shopAdList = payload.data;
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.perPage;
      state.error = '';
    });

    builder.addCase(fetchShopAdverts.rejected, (state, action) => {
      state.loading = false;
      state.advertList = [];
      state.error = action.error.message;
    });
  },
});

export default advertsSlice.reducer;
