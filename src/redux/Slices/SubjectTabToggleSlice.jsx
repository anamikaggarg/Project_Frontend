import { createSlice } from "@reduxjs/toolkit";

const SubjectTabToggleSlice = createSlice({
  name: "SubjectTabToogle",
  initialState: false,
  reducers: {
    toggleSubjectTab: (state, action) => {
      return (state = !state);
    },
    onSubjectTab: (state, action) => {
      return (state = true);
    },
    offSubjectTab: (state, action) => {
      return (state = false);
    },
  },
});

export const { toggleSubjectTab,onSubjectTab, offSubjectTab } = SubjectTabToggleSlice.actions;
export default SubjectTabToggleSlice.reducer;
