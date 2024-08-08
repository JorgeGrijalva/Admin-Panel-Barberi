import { createSlice } from '@reduxjs/toolkit';
import { THEME_CONFIG } from '../../configs/theme-config';

const initialState = {
  theme: { ...THEME_CONFIG },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    directionChange(state, action) {
      state.theme.direction = action.payload;
    },
    navCollapseTrigger(state) {
      state.theme.navCollapsed = !state.theme.navCollapsed;
    },
    themeChange(state, action) {
      state.theme.currentTheme = action.payload;
    },
    setParcelMode(state, action) {
      state.theme.parcelMode = action.payload;
    },
  },
});

export const {
  directionChange,
  navCollapseTrigger,
  themeChange,
  setParcelMode,
} = themeSlice.actions;
export default themeSlice.reducer;
