import { createSlice } from "@reduxjs/toolkit"


const userSlice = createSlice({
    initialState: {
        isLoggedIn: false,
        user: null,
    },
    name: 'user',
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        clearUser(state) {
            state.user = null;
            state.isLoggedIn = false;
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;


