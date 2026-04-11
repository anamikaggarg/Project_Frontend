import { createSlice } from "@reduxjs/toolkit";

const CourseSlice = createSlice({
  name: "Course",
  initialState: {
    course: null,
    iscourse: false,
    subjects: {
      subject: null,
      isSubject: false,
    },
  },
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
      state.iscourse = true;
    },
    onCourseTab: (state) => {
      state.iscourse = true;
    },
    offCourseTab: (state) => {
      state.iscourse = false;
    },
    resetCourse: (state) => {
      state.course = null;
      state.iscourse = false;
    },
    setSubject: (state, action) => {
      state.subjects.subject = action.payload; // ✅ stores the actual subject object
      state.subjects.isSubject = true;
    },
    resetSubject: (state) => {
      state.subjects.subject = null;
      state.subjects.isSubject = false;
    },
  },
});

export const {
  setCourse,
  resetCourse,
  resetSubject,
  setSubject,
  offCourseTab,
  onCourseTab,
} = CourseSlice.actions;

export default CourseSlice.reducer;