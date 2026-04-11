import { createSlice } from "@reduxjs/toolkit";

const instituteSlice = createSlice({
    name:"institute",
    initialState:{
        currentInstitute: null,
        isAuthenticated:false
    },
    reducers:{
        setInstitute:(state,action)=>{
            state.currentInstitute = action.payload;
            state.isAuthenticated = true;

        }

    }
})
export const {setInstitute} = instituteSlice.actions;
export default instituteSlice.reducer;