import { configureStore } from "@reduxjs/toolkit";
import instituteReducer from './slices/institute'
import userReducer from './slices/userSlice'
export const store = configureStore({
    reducer: {
        Institute: instituteReducer,
        User:userReducer
    }
})