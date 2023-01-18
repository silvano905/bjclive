import { createSlice } from '@reduxjs/toolkit';

export const liveChatSlice = createSlice({
    name: 'liveChat',
    initialState: {
        messages: [],
        chatId: null
    },
    reducers: {
        getMessages: (state, action) => {
            state.messages = action.payload
        },
        getChatId: (state, action) => {
            state.chatId = action.payload;
        },
        deleteMessage: (state, action) => {
            state.messages = state.messages.filter((item) => item.id !== action.payload)
        }
    },
});

export const { getMessages, getChatId } = liveChatSlice.actions;
export const selectMessages = (state) => state.liveChat.messages;
export const selectChatId = (state) => state.liveChat.chatId;

export default liveChatSlice.reducer;