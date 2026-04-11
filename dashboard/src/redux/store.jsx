import { configureStore } from "@reduxjs/toolkit";
import instituteReducer from './slices/institute'
export const store = configureStore({
    reducer: {
        Institute: instituteReducer
    }
})