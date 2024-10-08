import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_SLICE } from "./config";
import { LOGIN_PATH } from "../routes/paths";
import { AdminModel } from "../models/Admin";

interface AdminInterface {
  data: AdminModel | null;
  loggedIn: boolean;
}

const initialState: AdminInterface = {
  data: null,
  loggedIn: false,
};

export const authenticationSlice = createSlice({
  name: AUTH_SLICE,
  initialState,
  reducers: {
    loginFailed: (state: AdminInterface) => {
      state.data = null;
      state.loggedIn = true;
    },
    loginSuccess: (
      state: AdminInterface,
      action: PayloadAction<AdminModel>
    ) => {
      state.data = action.payload;
      state.loggedIn = true;
    },
    logout: (state: AdminInterface) => {
      localStorage.clear();
      window.location.href = LOGIN_PATH;
      state.data = null;
      state.loggedIn = false;
    },
  },
});

export const { loginSuccess, logout, loginFailed } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
