import { createSlice } from "@reduxjs/toolkit";

const ThemeSlice = createSlice({
  name: "Theme",
  initialState: false,
  reducers: {
    toggleTheme: (state) => {
      return !state;
    },
  },
});

export const { toggleTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
