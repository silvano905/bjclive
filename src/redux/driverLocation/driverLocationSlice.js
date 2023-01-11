import { createSlice } from '@reduxjs/toolkit';

export const driverLocationSlice = createSlice({
    name: 'driver',
    initialState: {
        location: null,
        renderDirectionsMap: null,
        RDMMap: null,
        RDMMaps: null
    },
    reducers: {
        getLocation: (state, action) => {
            state.location = action.payload
        },
        setLocation: (state, action) => {
            state.location = action.payload
        },
        setRDM: (state, action) => {
            state.renderDirectionsMap = action.payload
        },
        setRDMMap: (state, action) => {
            state.RDMMap = action.payload
        },
        setRDMMaps: (state, action) => {
            state.RDMMaps = action.payload
        }

    },
});

export const { setLocation, getLocation, setRDM, setRDMMap, setRDMMaps } = driverLocationSlice.actions;

export const selectDriverLocation = (state) => state.driver.location;
export const selectRDM = (state) => state.driver.renderDirectionsMap;
export const selectRDMMaps = (state) => state.driver.RDMMaps;
export const selectRDMMap = (state) => state.driver.RDMMap;



export default driverLocationSlice.reducer;