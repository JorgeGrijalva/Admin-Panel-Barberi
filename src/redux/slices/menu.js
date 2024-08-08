import { createSlice } from '@reduxjs/toolkit';

const initialMenuItem = {
  name: 'dashboard',
  url: 'dashboard',
  id: 1,
  data: {},
  refetch: true,
};

const initialState = {
  menuItems: [initialMenuItem],
  activeMenu: initialMenuItem,
};

const Menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    addMenu(state, action) {
      const existing = state.menuItems.find(
        (item) => item.id === action.payload.id,
      );

      if (!!existing) {
        state.activeMenu = { ...existing, refetch: true };
      } else {
        let tempProductItem = { ...action.payload, refetch: true };
        state.menuItems.push(tempProductItem);
        state.activeMenu = tempProductItem;
      }
    },

    removeFromMenu(state, action) {
      const { payload } = action;
      const nextActiveMenu = state.menuItems.find(
        (item) => item.url === payload?.nextUrl,
      );
      if (nextActiveMenu) {
        state.activeMenu = nextActiveMenu;
        state.menuItems = state.menuItems.filter(
          (item) => item.id !== payload.id,
        );
      }
    },

    replaceMenu(state, action) {
      const { payload } = action;
      const menuIndex = state.menuItems.findIndex(
        (item) => item.id === state.activeMenu.id,
      );
      state.menuItems[menuIndex] = payload;
      state.activeMenu = payload;
    },

    setActiveMenu(state, action) {
      state.activeMenu = action.payload;
    },

    setMenu(state, action) {
      state.menuItems[0] = action.payload;
      state.activeMenu = action.payload;
    },
    clearMenu(state, action) {
      state.menuItems = [initialMenuItem];
      state.activeMenu = initialMenuItem;
    },
    setMenuData(state, action) {
      const { payload } = action;
      const existingIndex = state.menuItems.findIndex(
        (item) => item.id === payload.activeMenu.id,
      );
      if (state.activeMenu.id === payload.activeMenu.id) {
        state.activeMenu.data = payload.data;
      }
      if (state.menuItems[existingIndex]) {
        state.menuItems[existingIndex].data = payload.data;
      }
    },
    setRefetch(state, action) {
      const { payload } = action;
      const existingIndex = state.menuItems.findIndex(
        (item) => item.id === payload.id,
      );
      state.activeMenu = { ...payload, refetch: true };
      if (state.menuItems[existingIndex]) {
        state.menuItems[existingIndex].refetch = true;
      }
    },
    disableRefetch(state, action) {
      const { payload } = action;
      const existingIndex = state.menuItems.findIndex(
        (item) => item.id === payload.id,
      );
      state.activeMenu.refetch = false;
      if (state.menuItems[existingIndex]) {
        state.menuItems[existingIndex].refetch = false;
      }
    },
  },
});

export const {
  addMenu,
  removeFromMenu,
  setActiveMenu,
  setMenu,
  clearMenu,
  setMenuData,
  setRefetch,
  disableRefetch,
  replaceMenu,
} = Menu.actions;
export default Menu.reducer;
