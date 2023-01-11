import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: null
    },
    reducers: {
        getMessages: (state, action) => {
            state.messages = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        }

    },
});

export const { getMessages, setMessages } = messagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;




export default messagesSlice.reducer;