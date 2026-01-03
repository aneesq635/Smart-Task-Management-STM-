import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    
    theme: "dark",
};

export const mainSlice = createSlice({
    name: "main",
    initialState: intialState,
    reducers: {
       
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const { setContacts, setTheme } = mainSlice.actions;

export default mainSlice.reducer;