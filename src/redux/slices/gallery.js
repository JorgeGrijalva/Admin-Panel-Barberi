import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import galleryService from 'services/gallery';

const initialState = {
  loading: false,
  types: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchGalleryTypes= createAsyncThunk('galleries/types', (params = {}) => {
  return galleryService.getFolders({ ...initialState.params, ...params })
    .then((res) => res);
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGalleryTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGalleryTypes.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.types = payload.data;
    //   state.meta = payload.meta;
    //   state.params.page = payload.meta.current_page;
    //   state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchGalleryTypes.rejected, (state, action) => {
      state.loading = false;
      state.faqs = [];
      state.error = action.error.message;
    });
  },
});

export default gallerySlice.reducer;
