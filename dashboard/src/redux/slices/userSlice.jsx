import { createSlice } from "@reduxjs/toolkit";

const currentUser = JSON.parse(sessionStorage.getItem("user"));

const userSlice = createSlice({
  name: "User",
  initialState: {
    user: currentUser || null,
    isauthenticated: currentUser ? true : false, 
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isauthenticated = true;
      sessionStorage.setItem("user", JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.user = null;
      state.isauthenticated = false;
      sessionStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;