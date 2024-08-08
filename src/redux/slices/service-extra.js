import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceExtraService from '../../services/service-extra';

const initialState = {
  loading: false,
  serviceExtra: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchServiceExtra = createAsyncThunk(
  'service-extra/fetchServiceExtra',
  (params = {}) => {
    return serviceExtraService.getAll({ ...initialState.params, ...params });
  },
);

const serviceExtraSlice = createSlice({
  name: 'service-extra',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchServiceExtra.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchServiceExtra.fulfilled, (state, action) => {
      state.loading = false;
      const { payload } = action;
      state.serviceExtra = action.payload.data.map((item) => ({
        ...item,
        title: item?.translation?.title,
        service: item?.service?.translation?.title,
        shop: item.shop?.translation?.title,
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchServiceExtra.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.serviceExtra = [];
    });
  },
});

export default serviceExtraSlice.reducer;
