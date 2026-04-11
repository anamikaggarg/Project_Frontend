import { configureStore } from "@reduxjs/toolkit";
import sidenavReducer from "./Slices/SidenavSlice";
import UserReducer from "./Slices/UserSlice";
import ThemeReducer from "./Slices/ThemeSlice";
import CourseReducer from './Slices/CourseSlice'
import SubjectTabToggleReducer from './Slices/SubjectTabToggleSlice'
export const store = configureStore({
  reducer: {
    sidenav: sidenavReducer,
    User: UserReducer,
    Theme: ThemeReducer,
    Course:CourseReducer,
    SubjectTabToggle:SubjectTabToggleReducer
  },
});
