import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deliveryService from '../../services/delivery';

const initialState = {
  loading: false,
  topRating: [],
  lowRating: [],
  topOrder: [],
  lowOrder: [],
  topMoney: [],
  lowMoney: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchTopRating = createAsyncThunk(
  'delivery/fetchTopRating',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchLowRating = createAsyncThunk(
  'delivery/fetchLowRating',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchTopOrders = createAsyncThunk(
  'delivery/fetchTopOrders',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchLowOrders = createAsyncThunk(
  'delivery/fetchLowOrders',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchTopMoney = createAsyncThunk(
  'delivery/fetchTopMoney',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

export const fetchLowMoney = createAsyncThunk(
  'delivery/fetchLowMoney',
  (params = {}) => {
    return deliveryService
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  }
);

const DeliveryStatistics = createSlice({
  name: 'statistics',
  initialState,
  extraReducers: (builder) => {
    // topRating
    builder.addCase(fetchTopRating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopRating.fulfilled, (state, action) => {
      const { payload } = action;

      state.loading = false;
      state.topRating = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchTopRating.rejected, (state, action) => {
      state.loading = false;
      state.topRating = [];
      state.error = action.error.message;
    });

    // lowRating
    builder.addCase(fetchLowRating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLowRating.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.lowRating = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchLowRating.rejected, (state, action) => {
      state.loading = false;
      state.lowRating = [];
      state.error = action.error.message;
    });

    // topOrders
    builder.addCase(fetchTopOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopOrders.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topOrder = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchTopOrders.rejected, (state, action) => {
      state.loading = false;
      state.topOrder = [];
      state.error = action.error.message;
    });

    // lowOrders
    builder.addCase(fetchLowOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLowOrders.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.lowOrder = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchLowOrders.rejected, (state, action) => {
      state.loading = false;
      state.lowOrder = [];
      state.error = action.error.message;
    });

    // topMoney
    builder.addCase(fetchTopMoney.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTopMoney.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.topMoney = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchTopMoney.rejected, (state, action) => {
      state.loading = false;
      state.topMoney = [];
      state.error = action.error.message;
    });

    // lowMoney
    builder.addCase(fetchLowMoney.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLowMoney.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.lowMoney = payload.data.slice(0, 5);
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchLowMoney.rejected, (state, action) => {
      state.loading = false;
      state.lowMoney = [];
      state.error = action.error.message;
    });
  },
});

export default DeliveryStatistics.reducer;
