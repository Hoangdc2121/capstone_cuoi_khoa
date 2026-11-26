import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  status: "checking" | "authenticated" | "unauthenticated" | "error";
};

const initialState: AuthState = {
  user: null,
  status: "checking",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Lưu thông tin người dùng sau khi đăng nhập thành công.
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },

    // Xóa thông tin người dùng trong Redux.
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
    // Không kiểm tra được phiên do lỗi kết nối hoặc server.
    sessionCheckFailed(state) {
      state.status = "error";
    },
  },
});

export const { setUser, clearUser, sessionCheckFailed } = authSlice.actions;

export default authSlice.reducer;
