import { createSlice } from "@reduxjs/toolkit";

const RightSideTabs = createSlice({
  name: "RightSideTabs",
  initialState: false,
  reducers: {
    closeRightSideTab: () => {
      return true;
    },
    openRightSideTab: () => {
      return false;
    },
    toggleRightSideTab: (state) => {
      return !state;
    },
  },
});

export const { closeRightSideTab, openRightSideTab, toggleRightSideTab } =
  RightSideTabs.actions;
export default RightSideTabs.reducer;
