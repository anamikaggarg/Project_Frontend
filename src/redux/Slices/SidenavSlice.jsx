import { createSlice } from "@reduxjs/toolkit";

const SidenavSlice = createSlice({
  name: "Sidenav",
  initialState: false,
  reducers: {
    sidenavtoggle: (state) => {
      console.log("hi")
      return state = !state
    },
    opensidenav: () => {
      return false;
    },
    closesidenav: () => {
      return false;
    },
  },
});

export const { sidenavtoggle,opensidenav,closesidenav } = SidenavSlice.actions;
export default SidenavSlice.reducer;
