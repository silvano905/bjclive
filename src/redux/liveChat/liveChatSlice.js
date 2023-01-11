import { createSlice } from '@reduxjs/toolkit';

export const liveChatSlice = createSlice({
    name: 'liveChat',
    initialState: {
        messages: [],
        chatId: null,
        user: null
    },
    reducers: {
        getMessages: (state, action) => {
            state.messages = action.payload
        },
        getUser: (state, action) => {
            state.user = action.payload
        },

        getChatId: (state, action) => {
            state.chatId = action.payload;
        },
        deleteMessage: (state, action) => {
            state.messages = state.messages.filter((item) => item.id !== action.payload)
        }
    },
});

export const { getMessages, getChatId, getUser} = liveChatSlice.actions;
export const selectMessages = (state) => state.liveChat.messages;
export const selectUser = (state) => state.liveChat.user;
export const selectChatId = (state) => state.liveChat.chatId;

export default liveChatSlice.reducer;