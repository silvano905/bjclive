import { createSlice } from '@reduxjs/toolkit';

export const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: []
    },
    reducers: {
        getAppointments: (state, action) => {
            state.appointments = action.payload
        }
    },
});

export const { getAppointments} = appointmentsSlice.actions;
export const selectAppointments = (state) => state.appointments.appointments;

export default appointmentsSlice.reducer;