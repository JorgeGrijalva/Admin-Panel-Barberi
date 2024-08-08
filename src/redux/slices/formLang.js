import { createSlice } from '@reduxjs/toolkit';
import { THEME_CONFIG } from '../../configs/theme-config';

const initialState = {
  languages: [],
  defaultLang: THEME_CONFIG.locale,
};

const FormLang = createSlice({
  name: 'formLang',
  initialState,
  reducers: {
    setLangugages(state, action) {
      state.languages = action.payload;
    },
    clearLangugages(state, action) {
      state.languages = [];
    },
    setDefaultLanguage(state, action) {
      state.defaultLang = action.payload;
    },
  },
});

export const { setLangugages, setDefaultLanguage, clearLangugages } =
  FormLang.actions;
export default FormLang.reducer;
