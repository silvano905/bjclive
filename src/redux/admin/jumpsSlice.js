import { createSlice } from '@reduxjs/toolkit';

export const jumpsSlice = createSlice({
    name: 'jump',
    initialState: {
        jumps: null
    },
    reducers: {
        setJumps: (state, action) => {
            state.jumps = action.payload
        },
        clearJump: (state, action) => {
            state.jumps = null
        },
    },
});

export const { setJumps, clearJump} = jumpsSlice.actions;
export const selectJumps = (state) => state.jump.jumps?state.jump.jumps:null;

export default jumpsSlice.reducer;