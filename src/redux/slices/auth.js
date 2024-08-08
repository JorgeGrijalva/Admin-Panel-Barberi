import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  firebaseToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData(state, action) {
      const { payload } = action;
      state.user = payload;
    },
    updateUser(state, action) {
      const { payload } = action;
      state.user = {
        ...state.user,
        ...payload,
        fullName: payload.firstname + ' ' + payload.lastname,
      };
    },
    clearUser(state) {
      state.user = null;
    },
    setFirebaseToken(state, action) {
      const { payload } = action;
      state.firebaseToken = payload;
    },
  },
});

export const { setUserData, clearUser, updateUser, setFirebaseToken } =
  authSlice.actions;
export default authSlice.reducer;
