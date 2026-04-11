import { createSlice } from "@reduxjs/toolkit";

const currentUser = JSON.parse(sessionStorage.getItem("user"));

const UserSlice = createSlice({
  name: "User",
  initialState: {
    user: currentUser || null,
    isauthenticated: currentUser ? true : false,
  },
  reducers: {
    logout: (state) => {
      state.isauthenticated = false;
      state.user = null;
      sessionStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.isauthenticated = true;
      state.user = action.payload.user;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { logout, setUser } = UserSlice.actions;
export default UserSlice.reducer;
