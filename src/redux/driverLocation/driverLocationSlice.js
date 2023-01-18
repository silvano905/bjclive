import { createSlice } from '@reduxjs/toolkit';

export const driverLocationSlice = createSlice({
    name: 'driver',
    initialState: {
        location: null
    },
    reducers: {
        getLocation: (state, action) => {
            state.location = action.payload
        },
        setLocation: (state, action) => {
            state.location = action.payload
        }

    },
});

export const { setLocation, getLocation } = driverLocationSlice.actions;

export const selectDriverLocation = (state) => state.driver.location;




export default driverLocationSlice.reducer;