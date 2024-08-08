import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SellerInvitations from '../../services/seller/invitations';

const initialState = {
  loading: false,
  invitations: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  links: null,
  meta: {},
};

export const fetchSellerMasterInvitations = createAsyncThunk(
  'master-invitations/fetchSellerInvitations',
  (params = {}) => {
    return SellerInvitations.getAll({
      ...initialState.params,
      ...params,
      role: 'master',
    });
  },
);

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSellerMasterInvitations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerMasterInvitations.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.invitations = payload.data.map((item) => {
        return {
          ...item,
          fullname: item.firstname + ' ' + item.lastname,
        };
      });
      state.meta = payload.meta;
      state.params.page = payload.meta.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerMasterInvitations.rejected, (state, action) => {
      state.loading = false;
      state.invitations = [];
      state.error = action.error.message;
    });
  },
});

export default invitationsSlice.reducer;
