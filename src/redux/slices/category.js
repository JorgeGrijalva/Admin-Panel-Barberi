import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerCategory from 'services/seller/category';
import categoryService from 'services/category';

const initialState = {
  loading: false,
  categories: [],
  error: '',
  params: {
    page: 1,
    perPage: 10,
  },
  meta: {},
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  (params = {}) => {
    return categoryService
      .getAllMain({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

export const fetchSellerCategory = createAsyncThunk(
  'category/fetchSellerCategory',
  (params = {}) => {
    return sellerCategory
      .getAll({ ...initialState.params, ...params })
      .then((res) => res);
  },
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.categories = payload.data.map((item) => ({
        active: item.active,
        img: item.img,
        name: item.translation !== null ? item.translation.title : 'no name',
        key: item.uuid + '_' + item.id,
        uuid: item.uuid,
        id: item.id,
        locales: item.locales,
        status: item.status,
        input: item?.input || '-',
      }));
      state.meta = payload.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta.per_page;
      state.error = '';
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.error.message;
    });

    //seller category
    builder.addCase(fetchSellerCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerCategory.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.categories = payload.data.map((item) => ({
        active: item.active,
        img: item.img,
        name: item.translation !== null ? item.translation.title : 'no name',
        key: item.uuid + '_' + item.id,
        uuid: item.uuid,
        id: item.id,
        locales: item.locales,
        status: item.status,
        shop: item.shop,

        // children: item.children?.map((child) => ({
        //   name:
        //     child.translation !== null ? child.translation.title : 'no name',
        //   uuid: child.uuid,
        //   key: item.uuid + '_' + child.id,
        //   img: child.img,
        //   id: item.id,
        //   locales: item.locales,
        //   active: child.active,
        //   children: child.children?.map((three) => ({
        //     name:
        //       three.translation !== null ? three.translation.title : 'no name',
        //     uuid: three.uuid,
        //     key: child.uuid + '_' + three.id,
        //     img: three.img,
        //     id: three.id,
        //     active: three.active,
        //     locales: item.locales,
        //   })),
        // })),
      }));
      state.meta = payload?.meta;
      state.params.page = payload.meta?.current_page;
      state.params.perPage = payload.meta?.per_page;
      state.error = '';
    });
    builder.addCase(fetchSellerCategory.rejected, (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.error.message;
    });
  },
});

export default categorySlice.reducer;
