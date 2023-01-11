import { createSlice } from '@reduxjs/toolkit';

export const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: {
        today: [],
        tomorrow: []
    },
    reducers: {
        getAppointmentsToday: (state, action) => {
            state.today = action.payload
        },
        getAppointmentsTomorrow: (state, action) => {
            state.tomorrow = action.payload
        }
    },
});

export const { getAppointmentsTomorrow, getAppointmentsToday} = appointmentsSlice.actions;
export const selectAppointmentsToday = (state) => state.appointments.today;
export const selectAppointmentsTomorrow = (state) => state.appointments.tomorrow;

export default appointmentsSlice.reducer;