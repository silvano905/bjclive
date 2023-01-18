import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        jumpStart: null,
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setJumpStart: (state, action) => {
            state.jumpStart = action.payload
        }
    },
});

export const { setUser, setJumpStart} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectJumpStart = (state) => state.user.jumpStart;

export default userSlice.reducer;