import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceDisabledTimes from '../../services/master/serviceDisabledTimes';
import { masterDisabledTimesServices as sellerMasterDisabledTimesServices } from '../../services/seller/master-disabled-times';
import { masterDisabledTimesServices as adminMasterDisabledTimesServices } from '../../services/master-disabled-times';

const initialState = {
  loading: false,
  disabledTimes: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchMasterDisabledTimes = createAsyncThunk(
  'disabledTimes/fetchMasterDisabledTimes',
  (params = {}) =>
    serviceDisabledTimes.getAll({ ...initialState.params, ...params })
);

export const fetchMasterDisabledTimesAsSeller = createAsyncThunk(
  'disabledTimes/fetchMasterDisabledTimesAsSeller',
  (params = {}) =>
    sellerMasterDisabledTimesServices.getAll({
      ...initialState.params,
      ...params,
    })
);

export const fetchMasterDisabledTimesAsAdmin = createAsyncThunk(
  'disabledTimes/fetchMasterDisabledTimesAsAdmin',
  (params = {}) =>
    adminMasterDisabledTimesServices.getAll({
      ...initialState.params,
      ...params,
    })
);

const disabledTimesSlice = createSlice({
  name: 'disabledTimes',
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMasterDisabledTimes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMasterDisabledTimes.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.meta = payload?.meta;
      state.params.page = payload?.meta?.current_page;
      state.params.perPage = payload?.meta?.per_page;
      state.error = '';

      state.disabledTimes = payload.data.map((item) => ({
        id: item?.id,
        title: item?.translation?.title || 'unknown',
        repeats: item?.repeats,
        date: item?.date,
        from: item?.from,
        to: item?.to,
        disabled: true,
        start: new Date(`${item?.date}T${item?.from}:00.000000Z`),
        end: new Date(`${item?.date}T${item?.to}:00.000000Z`),
      }));
    });
    builder.addCase(fetchMasterDisabledTimes.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.error?.message;
      state.disabledTimes = [];
    });

    // as admin
    builder.addCase(fetchMasterDisabledTimesAsAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMasterDisabledTimesAsAdmin.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.meta = payload?.meta;
        state.params.page = payload?.meta?.current_page;
        state.params.perPage = payload?.meta?.per_page;
        state.error = '';

        state.disabledTimes = payload.data.map((item) => ({
          id: item?.id,
          title: item?.translation?.title || 'unknown',
          repeats: item?.repeats,
          date: item?.date,
          from: item?.from,
          to: item?.to,
          disabled: true,
          start: new Date(`${item?.date}T${item?.from}:00.000000Z`),
          end: new Date(`${item?.date}T${item?.to}:00.000000Z`),
        }));
      }
    );
    builder.addCase(
      fetchMasterDisabledTimesAsAdmin.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action?.error?.message;
        state.disabledTimes = [];
      }
    );

    // as seller
    builder.addCase(fetchMasterDisabledTimesAsSeller.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMasterDisabledTimesAsSeller.fulfilled,
      (state, action) => {
        const { payload } = action;
        state.loading = false;
        state.meta = payload?.meta;
        state.params.page = payload?.meta?.current_page;
        state.params.perPage = payload?.meta?.per_page;
        state.error = '';

        state.disabledTimes = payload.data.map((item) => ({
          id: item?.id,
          title: item?.translation?.title || 'unknown',
          repeats: item?.repeats,
          date: item?.date,
          from: item?.from,
          to: item?.to,
          disabled: true,
          start: new Date(`${item?.date}T${item?.from}:00.000000Z`),
          end: new Date(`${item?.date}T${item?.to}:00.000000Z`),
        }));
      }
    );
    builder.addCase(
      fetchMasterDisabledTimesAsSeller.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action?.error?.message;
        state.disabledTimes = [];
      }
    );
  },
});

export default disabledTimesSlice.reducer;
